import { getContent } from '@/lib/store';
import Site from '@/components/site/Site';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const c = await getContent();
  return {
    title: c.seo?.title || 'Itika E-Commerce',
    description: c.seo?.description,
    openGraph: { title: c.seo?.title, description: c.seo?.description },
  };
}

export default async function Home() {
  const content = await getContent();
  return <Site content={content} />;
}
