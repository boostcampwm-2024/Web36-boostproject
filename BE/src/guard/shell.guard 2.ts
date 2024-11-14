import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ShellService } from '../shell/shell.service';
import { Request } from 'express';

@Injectable()
export class ShellGuard implements CanActivate {
  constructor(private shellService: ShellService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const shellId = Number(request.params.shellId);
    const sessionId = request.sessionID;

    return this.shellService.isMappingSession(sessionId, shellId);
  }
}
