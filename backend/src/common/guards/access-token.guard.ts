import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any, context: any) {
    if (err || !user) {
      console.error('--- ACCESS TOKEN GUARD REFUSED ---');
      console.error('Error:', err);
      console.error('Info:', info?.message);
      console.error('Context:', context.switchToHttp().getRequest().url);
    }
    return super.handleRequest(err, user, info, context);
  }
}
