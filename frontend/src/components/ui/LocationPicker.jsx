import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  X, 
  Check,
  Maximize2,
  Minimize2,
  Search,
  Loader2,
  MapPinned,
  AlertCircle
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from './button';

// Fix for default marker icons in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom solar-themed marker icon
const solarMarkerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="48">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.3"/>
        </filter>
      </defs>
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 14 8 14s8-8.75 8-14c0-4.42-3.58-8-8-8z" fill="#FFD700" filter="url(#shadow)"/>
      <circle cx="12" cy="8" r="4" fill="#000033"/>
      <circle cx="12" cy="8" r="2" fill="#FFD700"/>
    </svg>
  `),
  iconSize: [32, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -48],
});

// Draggable Marker Component
const DraggableMarker = ({ position, setPosition }) => {
  const markerRef = useRef(null);
  
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latlng = marker.getLatLng();
          setPosition({
            lat: latlng.lat,
            lng: latlng.lng
          });
        }
      },
    }),
    [setPosition]
  );

  // Handle map clicks
  useMapEvents({
    click(e) {
      setPosition({
        lat: e.latlng.lat,
        lng: e.latlng.lng
      });
    },
  });

  return position ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[position.lat, position.lng]}
      ref={markerRef}
      icon={solarMarkerIcon}
    />
  ) : null;
};

// Component to recenter map
const MapController = ({ center, shouldCenter }) => {
  const map = useMap();
  
  useEffect(() => {
    if (shouldCenter && center) {
      map.flyTo([center.lat, center.lng], 15, {
        duration: 1
      });
    }
  }, [center, shouldCenter, map]);

  return null;
};

const LocationPicker = ({
  value = { latitude: '', longitude: '', location: '' },
  onChange,
  errors = {},
  touched = {},
  onBlur,
  className = ''
}) => {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState(
    value.latitude && value.longitude 
      ? { lat: parseFloat(value.latitude), lng: parseFloat(value.longitude) }
      : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [shouldCenter, setShouldCenter] = useState(false);
  const [locationName, setLocationName] = useState(value.location || '');
  const [addressDetails, setAddressDetails] = useState(value.addressDetails || null);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);
  const suggestionsTimeoutRef = useRef(null);
  
  // Default center (India)
  const defaultCenter = { lat: 20.5937, lng: 78.9629 };
  const mapCenter = position || defaultCenter;

  // Debounced autocomplete search
  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
    }
    setIsLoadingSuggestions(false);
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Clear previous timeout
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    // Debounce the API call
    suggestionsTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  };

  // Select a suggestion
  const selectSuggestion = (suggestion) => {
    const newPos = {
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon)
    };
    
    // Build location name from address
    const address = suggestion.address;
    setAddressDetails(address); // Store address details
    const name = [
      address?.city || address?.town || address?.village || address?.suburb || address?.county,
      address?.state,
      address?.country
    ].filter(Boolean).join(', ');
    
    setPosition(newPos);
    setLocationName(name || suggestion.display_name);
    setSearchQuery(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    setShouldCenter(true);
    setTimeout(() => setShouldCenter(false), 100);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(newPos);
          setShouldCenter(true);
          setTimeout(() => setShouldCenter(false), 100);
          reverseGeocode(newPos);
        },
        (error) => {
          console.error('Geolocation error:', error);
        }
      );
    }
  };

  // Reverse geocode to get location name
  const reverseGeocode = async (pos) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.lat}&lon=${pos.lng}&addressdetails=1`
      );
      const data = await response.json();
      if (data.display_name) {
        const address = data.address;
        setAddressDetails(address); // Store address details
        const name = [
          address?.city || address?.town || address?.village || address?.suburb || address?.county,
          address?.state,
          address?.country
        ].filter(Boolean).join(', ');
        setLocationName(name || data.display_name);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  // Search for location (when pressing Enter or clicking search)
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&addressdetails=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        selectSuggestion(data[0]);
      }
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsSearching(false);
  };

  // Update position when marker is placed or dragged
  useEffect(() => {
    if (position) {
      reverseGeocode(position);
    }
  }, [position]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, []);

  // Update dropdown position when showing suggestions
  useEffect(() => {
    if (showSuggestions && searchContainerRef.current) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
  }, [showSuggestions]);

  // Confirm selection
  const confirmSelection = () => {
    if (position) {
      onChange({
        latitude: position.lat.toFixed(6),
        longitude: position.lng.toFixed(6),
        location: locationName,
        addressDetails: addressDetails
      });
    }
    setIsMapOpen(false);
    setIsFullscreen(false);
  };

  // Cancel selection
  const cancelSelection = () => {
    // Reset to original values
    if (value.latitude && value.longitude) {
      setPosition({ lat: parseFloat(value.latitude), lng: parseFloat(value.longitude) });
    } else {
      setPosition(null);
    }
    setLocationName(value.location || '');
    setSearchQuery('');
    setSuggestions([]);
    setIsMapOpen(false);
    setIsFullscreen(false);
  };

  const hasLocationError = touched.location && errors.location;
  const hasLatError = touched.latitude && errors.latitude;
  const hasLngError = touched.longitude && errors.longitude;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Input */}
      <div className="md:col-span-2">
        <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${
          hasLocationError ? 'text-red-400' : 'text-white/60'
        }`}>
          Location *
        </label>
        <div className="relative">
          <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
            hasLocationError ? 'text-red-400/50' : 'text-white/30'
          }`} />
          <input
            type="text"
            name="location"
            value={value.location}
            onChange={(e) => onChange({ ...value, location: e.target.value })}
            onBlur={() => onBlur?.('location')}
            placeholder="Click the map button to select location"
            className={`w-full pl-12 pr-14 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 focus:outline-none transition-colors ${
              hasLocationError 
                ? 'border-red-500/50 focus:border-red-500' 
                : 'border-white/10 focus:border-solar-yellow/50'
            }`}
          />
          <Button
            type="button"
            variant="ghost" 
            size="icon"
            onClick={() => setIsMapOpen(true)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-solar-yellow/20 hover:bg-solar-yellow/30 rounded-lg transition-colors group h-auto w-auto"
          >
            <MapPin className="w-5 h-5 text-solar-yellow group-hover:scale-110 transition-transform" />
          </Button>
        </div>
        {hasLocationError && (
          <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {errors.location}
          </p>
        )}
      </div>

      {/* Lat/Long Inputs */}
      <div className="grid grid-cols-2 gap-4">
        {/* Latitude */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${
            hasLatError ? 'text-red-400' : 'text-white/60'
          }`}>
            Latitude *
          </label>
          <div className="relative">
            <Navigation className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              hasLatError ? 'text-red-400/50' : 'text-white/30'
            }`} />
            <input
              type="number"
              step="any"
              name="latitude"
              value={value.latitude}
              onChange={(e) => onChange({ ...value, latitude: e.target.value })}
              onBlur={() => onBlur?.('latitude')}
              placeholder="e.g., 28.6139"
              className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                hasLatError 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-white/10 focus:border-solar-yellow/50'
              }`}
            />
          </div>
          {hasLatError && (
            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.latitude}
            </p>
          )}
        </div>

        {/* Longitude */}
        <div>
          <label className={`block text-xs font-bold uppercase tracking-widest mb-3 transition-colors ${
            hasLngError ? 'text-red-400' : 'text-white/60'
          }`}>
            Longitude *
          </label>
          <div className="relative">
            <Navigation className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rotate-90 ${
              hasLngError ? 'text-red-400/50' : 'text-white/30'
            }`} />
            <input
              type="number"
              step="any"
              name="longitude"
              value={value.longitude}
              onChange={(e) => onChange({ ...value, longitude: e.target.value })}
              onBlur={() => onBlur?.('longitude')}
              placeholder="e.g., 77.2090"
              className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-xl text-white placeholder:text-white/30 focus:outline-none transition-colors ${
                hasLngError 
                  ? 'border-red-500/50 focus:border-red-500' 
                  : 'border-white/10 focus:border-solar-yellow/50'
              }`}
            />
          </div>
          {hasLngError && (
            <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.longitude}
            </p>
          )}
        </div>
      </div>

      {/* Map Modal */}
      <AnimatePresence>
        {isMapOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && cancelSelection()}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`bg-deep-navy border border-white/10 shadow-2xl rounded-3xl flex flex-col ${
                isFullscreen 
                  ? 'fixed inset-4' 
                  : 'w-full max-w-4xl h-[600px]'
              }`}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-solar-yellow/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-solar-yellow" />
                  </div>
                  <div>
                    <h3 className="font-black uppercase tracking-wider text-sm">Select Location</h3>
                    <p className="text-xs text-white/40">Click or drag the marker to set location</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 glass rounded-lg hover:bg-white/10 transition-colors h-auto w-auto"
                  >
                    {isFullscreen ? (
                      <Minimize2 className="w-5 h-5 text-white/60" />
                    ) : (
                      <Maximize2 className="w-5 h-5 text-white/60" />
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={cancelSelection}
                    className="p-2 glass rounded-lg hover:bg-red-500/20 transition-colors h-auto w-auto"
                  >
                    <X className="w-5 h-5 text-white/60" />
                  </Button>
                </div>
              </div>

              {/* Search Bar with Autocomplete */}
              <div className="p-4 border-b border-white/10 flex gap-2 relative z-50">
                <div className="flex-1 relative" ref={searchContainerRef}>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        searchLocation();
                      } else if (e.key === 'Escape') {
                        setShowSuggestions(false);
                      }
                    }}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Search for a location..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-solar-yellow/50 transition-colors"
                  />
                  
                  {/* Loading indicator */}
                  {isLoadingSuggestions && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 text-solar-yellow animate-spin" />
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={searchLocation}
                  disabled={isSearching}
                  className="px-4 py-3 bg-solar-yellow/20 hover:bg-solar-yellow/30 rounded-xl transition-colors flex items-center gap-2 h-auto"
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 text-solar-yellow animate-spin" />
                  ) : (
                    <Search className="w-5 h-5 text-solar-yellow" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={getCurrentLocation}
                  className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors flex items-center gap-2 h-auto"
                  title="Use current location"
                >
                  <Crosshair className="w-5 h-5 text-white/60" />
                </Button>
              </div>

              {/* Map Container */}
              <div className="flex-1 relative overflow-hidden" onClick={() => setShowSuggestions(false)}>
                <MapContainer
                  center={[mapCenter.lat, mapCenter.lng]}
                  zoom={position ? 15 : 5}
                  className="w-full h-full"
                  style={{ background: '#001f3f' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker position={position} setPosition={setPosition} />
                  <MapController center={position} shouldCenter={shouldCenter} />
                </MapContainer>

                {/* Draggable Marker Hint */}
                {position && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full text-xs font-bold text-solar-yellow z-50"
                  >
                    ✨ Drag marker to adjust position
                  </motion.div>
                )}

                {/* Coordinates Display */}
                {position && (
                  <div className="absolute bottom-4 left-4 glass p-4 rounded-xl z-50">
                    <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Selected Coordinates</p>
                    <p className="text-sm font-bold text-solar-yellow">
                      {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
                    </p>
                    {locationName && (
                      <p className="text-xs text-white/60 mt-1 max-w-xs truncate">{locationName}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between">
                <div className="text-sm text-white/40">
                  {position ? (
                    <span className="text-solar-yellow">📍 Location selected</span>
                  ) : (
                    <span>Click on the map to select a location</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={cancelSelection}
                    className="px-6 py-3 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors h-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={confirmSelection}
                    disabled={!position}
                    className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-wider flex items-center gap-2 transition-all h-auto ${
                      position
                        ? 'bg-solar-yellow text-deep-navy hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.3)]'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    Confirm Location
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Autocomplete Suggestions Portal - renders outside modal DOM to avoid z-index issues */}
      {showSuggestions && suggestions.length > 0 && createPortal(
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed rounded-xl overflow-hidden max-h-60 overflow-y-auto shadow-2xl border border-solar-yellow/20"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 99999,
              backgroundColor: 'rgba(0, 31, 63, 0.95)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,215,0,0.1)'
            }}
          >
            {suggestions.map((suggestion, index) => (
              <Button
                key={suggestion.place_id || index}
                type="button"
                variant="ghost"
                onClick={() => selectSuggestion(suggestion)}
                className="w-full px-4 py-3 flex items-start justify-start gap-3 hover:bg-solar-yellow/10 transition-colors text-left border-b border-white/5 last:border-b-0 h-auto rounded-none"
                style={{ backgroundColor: 'transparent' }}
              >
                <MapPinned className="w-5 h-5 text-solar-yellow shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-white truncate">
                    {suggestion.display_name?.split(',')[0]}
                  </p>
                  <p className="text-xs text-white/40 truncate">
                    {suggestion.display_name?.split(',').slice(1, 4).join(',')}
                  </p>
                </div>
              </Button>
            ))}
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default LocationPicker;
