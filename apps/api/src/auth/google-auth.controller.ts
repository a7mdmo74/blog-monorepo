import { Controller, Get, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/index.js';
import { Request, Response } from 'express';

@Controller('auth')
export class GoogleAuthController {
  constructor(
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('google')
  googleLogin(@Res() res: Response) {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const callbackUrl = encodeURIComponent(process.env.GOOGLE_CALLBACK_URL || 'https://blog-monorepo-a7mdmo74.up.railway.app/auth/google/callback');
    const scope = encodeURIComponent('email profile');

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code&scope=${scope}&access_type=offline`;

    res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const code = req.query.code as string;

    if (!code) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=no_code`);
    }

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL || 'https://blog-monorepo-a7mdmo74.up.railway.app/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      return res.redirect(`${frontendUrl}/login?error=token_exchange_failed`);
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();

    let user = await this.prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          password: 'google-oauth',
        },
      });
    } else if (!user.avatar && googleUser.picture) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { avatar: googleUser.picture },
      });
    }

    const jwtToken = this.jwt.sign({ sub: user.id, email: user.email });

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(
      `${frontendUrl}/auth/callback?token=${jwtToken}&user=${encodeURIComponent(JSON.stringify({ id: user.id, name: user.name, email: user.email }))}`,
    );
  }
}
