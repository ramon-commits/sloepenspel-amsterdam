import reviewsData from "@/content/reviews.json";
import faqData from "@/content/faq.json";
import restaurantsData from "@/content/restaurants.json";
import services from "@/content/services.json";
import { articles } from "@/content/articles";
import { overPage } from "@/content/pages";
import { AdminShell, type SidebarCounts } from "./AdminShell";

export default function AdminPage() {
  const counts: SidebarCounts = {
    reviews: reviewsData.reviews.length,
    faq: faqData.faqs.length,
    restaurants: restaurantsData.length,
    locations: services.locations.length,
    blog: articles.length,
    team: overPage.team.members.length,
  };

  return <AdminShell counts={counts} />;
}
