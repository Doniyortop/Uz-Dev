import { Locale } from '@/types';
import { Metadata } from 'next';
import FreelancerProfileClient from './profile-client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} | UzDev Hub Freelancer`,
    description: `Профиль фрилансера ${username} на UzDev Hub. Посмотрите услуги и портфолио.`,
  };
}

export default async function FreelancerProfile({
  params,
}: {
  params: Promise<{ lang: Locale; username: string }>;
}) {
  const { lang, username } = await params;
  
  return <FreelancerProfileClient lang={lang} username={username} />;
}
