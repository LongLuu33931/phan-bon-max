import { FeaturedProductsSection } from "@/components/home/featured-products-section";
import { HeroSlider } from "@/components/home/hero-slider";
import { HomeContactSection } from "@/components/home/home-contact-section";
import { HomeNewsSection } from "@/components/home/home-news-section";
import { HomePainPointsSection } from "@/components/home/home-pain-points-section";
import { HomeSolutionSection } from "@/components/home/home-solution-section";
import { HomeWhyChooseSection } from "@/components/home/home-why-choose-section";
import { TestimonialStack } from "@/components/testimonial/testimonial-stack";
import {
    getCategories,
    getPosts,
    getProducts,
    getSettings,
    getTestimonials,
} from "@/lib/data";
import { PublicLayout } from "./(public-layout)";

const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "MAX 8000",
    url: "https://phanbonmax8000.vn",
    logo: "https://phanbonmax8000.vn/logo.png",
    sameAs: ["https://facebook.com/nongnghiepxanhvn2026"],
};

export default async function Home() {
    const [products, categories, posts, settings, testimonials] =
        await Promise.all([
            getProducts(),
            getCategories(),
            getPosts(),
            getSettings(),
            getTestimonials(),
        ]);
    const featured = products
        .filter((product) => product.isFeatured)
        .slice(0, 6);
    const heroProduct =
        products.find((product) => product.slug === "fruit-max-npk-8000") ??
        featured[0] ??
        products[0];

    return (
        <PublicLayout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(organizationJsonLd).replace(
                        /</g,
                        "\\u003c",
                    ),
                }}
            />
            <HeroSlider
                slides={settings.heroSlides ?? []}
                fallbackProduct={heroProduct}
            />
            {/* <HomeFeatureStrip /> */}
            <HomePainPointsSection />
            <HomeSolutionSection brandName={settings.brandName} />
            <FeaturedProductsSection
                categories={categories}
                products={featured}
            />
            <HomeWhyChooseSection />
            <TestimonialStack testimonials={testimonials} />
            <HomeNewsSection posts={posts} />
            <HomeContactSection />
        </PublicLayout>
    );
}
