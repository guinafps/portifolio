import { HomeExperience } from "@/components/public/home-experience";
import { getPublishedProjects, getSettings } from "@/lib/data";

export default async function Home(){const [projects,settings]=await Promise.all([getPublishedProjects(),getSettings()]);return <HomeExperience projects={projects} settings={settings}/>;}
