'use client';

import { AccordionGroup } from '@/components/ui/Accordion';

interface FAQProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export default function FAQ({ items }: FAQProps) {
  const accordionItems = items.map((item) => ({
    title: item.question,
    content: item.answer,
  }));

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">常见问题</h2>
        <AccordionGroup items={accordionItems} size="md" />
      </div>
    </section>
  );
}
