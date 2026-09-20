import { useNavigate } from "react-router-dom";
import Navbar from "../components/organisms/Navbar.jsx";
import HeroBanner from "../components/organisms/HeroBanner.jsx";
import CourseSection from "../components/organisms/CourseSection.jsx";
import NewsletterSection from "../components/organisms/NewsletterSection.jsx";
import Footer from "../components/organisms/Footer.jsx";
import { CURRENT_USER, HERO_IMAGE, NEWSLETTER_IMAGE, categories, courses } from "../data/courses.js";
import { userMenu } from "../data/navigation.js";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar
        variant="app"
        user={CURRENT_USER}
        menuItems={userMenu}
        onLogout={() => navigate("/login")}
      />

      <main className="mx-auto max-w-[1120px] px-4 pb-12 pt-6 md:px-6 md:pb-16 md:pt-10">
        <HeroBanner
          title="Revolusi Pembelajaran: Temukan Ilmu Baru melalui Platform Video Interaktif!"
          description="Temukan ilmu baru yang menarik dan mendalam melalui koleksi video pembelajaran berkualitas tinggi. Tidak hanya itu, Anda juga dapat berpartisipasi dalam latihan interaktif yang akan meningkatkan pemahaman Anda."
          ctaLabel="Temukan Video Course untuk Dipelajari!"
          ctaHref="#koleksi"
          image={HERO_IMAGE}
        />

        <div className="mt-10 md:mt-14">
          <CourseSection
            title="Koleksi Video Pembelajaran Unggulan"
            subtitle="Jelajahi Dunia Pengetahuan Melalui Pilihan Kami!"
            categories={categories}
            courses={courses}
          />
        </div>

        <div className="mt-12 md:mt-16">
          <NewsletterSection image={NEWSLETTER_IMAGE} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
