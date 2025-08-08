import {NextRequest, NextResponse} from 'next/server';
import {MercadoPagoConfig, Preference} from 'mercadopago';

const client = new MercadoPagoConfig({accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!});

export async function POST(req: NextRequest) {
  try {
    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: 'donation',
            title: 'Donation to WebStats Central',
            quantity: 1,
            unit_price: 10,
            currency_id: 'ARS',
          },
        ],
        back_urls: {
          success: `${req.nextUrl.origin}/`,
          failure: `${req.nextUrl.origin}/`,
          pending: `${req.nextUrl.origin}/`,
        },
        auto_return: 'approved',
      },
    });

    return NextResponse.json({id: preference.id});
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {error: 'Failed to create payment preference'},
      {status: 500}
    );
  }
}
