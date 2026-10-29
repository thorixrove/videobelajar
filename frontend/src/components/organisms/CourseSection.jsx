import { useState } from "react";
import CategoryTabs from "../molecules/CategoryTabs.jsx";
import CourseCard from "../molecules/CourseCard.jsx";

const ALL = "Semua Kelas";

export default function CourseSection({ title, subtitle, categories, courses }) {
  const [active, setActive] = useState(ALL);
  const visible = active === ALL ? courses : courses.filter((c) => c.category === active);

  return (
    <section id="koleksi" className="scroll-mt-24">
      <h2 className="font-heading text-2xl font-semibold leading-tight md:text-[32px]">{title}</h2>
      <p className="mt-2 text-xs text-muted md:text-sm">{subtitle}</p>

      <div className="mt-6">
        <CategoryTabs categories={categories} active={active} onChange={setActive} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
