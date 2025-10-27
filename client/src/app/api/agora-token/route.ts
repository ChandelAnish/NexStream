// src/app/api/agora-token/route.ts
import { RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole } from 'agora-access-token';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId, channelName, rtcUid } = await request.json();

    console.log('Token request received:', { userId, channelName, rtcUid });

    if (!userId || !channelName || rtcUid === undefined) {
      return NextResponse.json({ 
        error: 'userId, channelName, and rtcUid are required' 
      }, { status: 400 });
    }

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      console.error('Missing Agora credentials');
      return NextResponse.json({ 
        error: 'Agora credentials not configured' 
      }, { status: 500 });
    }

    console.log('App ID:', appId);
    console.log('App Certificate exists:', !!appCertificate);

    // Token expiration time (24 hours for better stability)
    const expirationTimeInSeconds = 86400; // 24 hours
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    console.log('Generating tokens...');
    console.log('Current timestamp:', currentTimestamp);
    console.log('Expiration timestamp:', privilegeExpiredTs);

    // Generate RTC token with numeric UID
    const rtcToken = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      rtcUid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    console.log('RTC Token generated:', rtcToken.substring(0, 20) + '...');

    // Generate RTM token with string UID
    // IMPORTANT: RTM token uses the string userId directly
    const rtmToken = RtmTokenBuilder.buildToken(
      appId,
      appCertificate,
      userId, // Must be the exact string userId
      RtmRole.Rtm_User,
      privilegeExpiredTs
    );

    console.log('RTM Token generated:', rtmToken.substring(0, 20) + '...');

    return NextResponse.json({ 
      rtcToken, 
      rtmToken,
      debug: {
        appId,
        userId,
        channelName,
        rtcUid,
        expirationTime: new Date(privilegeExpiredTs * 1000).toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error generating Agora tokens:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json({ 
      error: 'Failed to generate tokens',
      details: error.message 
    }, { status: 500 });
  }
}