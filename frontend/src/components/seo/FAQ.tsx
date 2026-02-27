"use client";

interface FAQProps {
  items: Array<{
    question: string;
    answer: string;
  }>;
}

export default function FAQ({ items }: FAQProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          常见问题
        </h2>
        <div className="space-y-4">
          {items.map((item, index) => (
            <details
              key={index}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                <span className="font-medium text-gray-900">
                  {item.question}
                </span>
                <svg
                  className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-4 pb-4 text-gray-600">{item.answer}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
