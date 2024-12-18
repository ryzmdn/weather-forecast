function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="custom-scrollbar flex items-center space-x-4 overflow-x-auto py-6">
        {children}
      </div>
    </section>
  );
}

function Card({ title, children }) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm text-gray-300">{title}</h4>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  );
}

export { Section, Card };
