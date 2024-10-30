/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

// https://docs.nestjs.com/recipes/passport#implementing-passport-local
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {}
