import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import HomePage from '@/pages/HomePage/HomePage';
import SkillsPage from '@/pages/SkillsPage/SkillsPage';
import ProjectsPage from '@/pages/ProjectsPage/ProjectsPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage/ProjectDetailPage';
import ArenaPage from '@/pages/ArenaPage/ArenaPage';
import ArenaDetailPage from '@/pages/ArenaDetailPage/ArenaDetailPage';
import ContestsPage from '@/pages/ContestsPage/ContestsPage';
import PortfolioPage from '@/pages/PortfolioPage/PortfolioPage';
import ResumePage from '@/pages/ResumePage/ResumePage';
import DictionaryPage from '@/pages/DictionaryPage/DictionaryPage';
import FriendsPage from '@/pages/FriendsPage/FriendsPage';
import RankingPage from '@/pages/RankingPage/RankingPage';
import GuildPage from '@/pages/GuildPage/GuildPage';
import ProfilePage from '@/pages/ProfilePage/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="skills" element={<SkillsPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="arena" element={<ArenaPage />} />
        <Route path="arena/:id" element={<ArenaDetailPage />} />
        <Route path="contests" element={<ContestsPage />} />
        <Route path="friends" element={<FriendsPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="guild" element={<GuildPage />} />
        <Route path="portfolio" element={<PortfolioPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="dict" element={<DictionaryPage />} />
        <Route path="me" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
