import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Profile } from 'passport';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.PORT_URL}api/auth/github/callback`,
      scope: ['user:email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err?: Error | null, profile?: any) => void,
  ) {
    const { displayName, username, photos, emails } = profile;
    const name = displayName ? displayName : username;
    const user = {
      email: emails[0].value,
      firstName: name,
      lastName: null,
      picture: photos[0].value,
      accessToken,
    };
    done(null, user);
  }
}
