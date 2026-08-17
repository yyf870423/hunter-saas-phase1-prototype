import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { AppShell, OpsShell } from "./components/Shell";
import { Button } from "./components/ui";
import { Icon } from "./components/Icon";
import { LoginPage, ApplyPage, OnboardingPage } from "./pages/AccessPages";
import { ReviewHub } from "./pages/ReviewHub";
import { ComponentsPage, StoriesReviewPage } from "./pages/ReviewPages";
import { Dashboard } from "./pages/Dashboard";
import { AssetsPage, EntityListPage } from "./pages/ListPages";
import {
  NewWorkstreamPage,
  WorkstreamDetailPage,
} from "./pages/WorkstreamConversationPages";
import {
  CommunicationPage,
  SignalDetailPage,
  TaskDetailPage,
} from "./pages/TaskSignalPages";
import {
  MappingDetailPage,
  OpportunityDetailPage,
  ProgressDetailPage,
} from "./pages/AssetDetailPages";
import {
  ImportRunPage,
  ImportsPage,
  ImportWizardPage,
} from "./pages/ImportPages";
import {
  AutomationSettingsPage,
  DataSettingsPage,
  NotificationSettingsPage,
  PlatformSettingsPage,
  ProfileSettingsPage,
  SubscriptionSettingsPage,
  UsageSettingsPage,
} from "./pages/SettingsPages";
import {
  OpsDashboard,
  OpsListPage,
  OpsSubscriptionsPage,
  OpsTaskDetailPage,
  OpsUsagePage,
  OpsWorkspaceDetailPage,
} from "./pages/OpsPages";
import {
  AssetDetailPageV2,
  AssetListPageV2,
  MatchReviewPageV2,
} from "./pages/AssetPagesV2";
import { IntermediateCoveragePage } from "./pages/IntermediateCoveragePage";

function UserLayout() {
  return (
    <AppShell>
      <Routes>
        <Route path="/home" element={<Dashboard />} />
        <Route
          path="/workstreams"
          element={<Navigate to="/workstreams/position-vla/position" replace />}
        />
        <Route path="/workstreams/new" element={<NewWorkstreamPage />} />
        <Route
          path="/workstreams/:id/client"
          element={<WorkstreamDetailPage kind="client" />}
        />
        <Route
          path="/workstreams/:id/position"
          element={<WorkstreamDetailPage kind="position" />}
        />
        <Route
          path="/workstreams/:id/mapping"
          element={<WorkstreamDetailPage kind="mapping" />}
        />
        <Route
          path="/workstreams/:id/career"
          element={<WorkstreamDetailPage kind="career" />}
        />
        <Route path="/tasks" element={<EntityListPage kind="tasks" />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/signals" element={<EntityListPage kind="signals" />} />
        <Route path="/signals/:id" element={<SignalDetailPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route
          path="/companies"
          element={<AssetListPageV2 kind="companies" />}
        />
        <Route
          path="/companies/:id"
          element={<AssetDetailPageV2 kind="company" />}
        />
        <Route path="/contacts" element={<AssetListPageV2 kind="contacts" />} />
        <Route
          path="/contacts/:id"
          element={<AssetDetailPageV2 kind="contact" />}
        />
        <Route
          path="/opportunities"
          element={<EntityListPage kind="opportunities" />}
        />
        <Route path="/opportunities/:id" element={<OpportunityDetailPage />} />
        <Route
          path="/positions"
          element={<AssetListPageV2 kind="positions" />}
        />
        <Route
          path="/positions/:id"
          element={<AssetDetailPageV2 kind="position" />}
        />
        <Route path="/matching/:positionId" element={<MatchReviewPageV2 />} />
        <Route
          path="/candidates"
          element={<AssetListPageV2 kind="candidates" />}
        />
        <Route
          path="/candidates/:id"
          element={<AssetDetailPageV2 kind="candidate" />}
        />
        <Route path="/mappings" element={<EntityListPage kind="mappings" />} />
        <Route path="/mappings/:id" element={<MappingDetailPage />} />
        <Route path="/papers" element={<AssetListPageV2 kind="papers" />} />
        <Route
          path="/papers/:id"
          element={<AssetDetailPageV2 kind="paper" />}
        />
        <Route path="/patents" element={<AssetListPageV2 kind="patents" />} />
        <Route
          path="/patents/:id"
          element={<AssetDetailPageV2 kind="patent" />}
        />
        <Route path="/communications/:id" element={<CommunicationPage />} />
        <Route path="/progress/:id" element={<ProgressDetailPage />} />
        <Route path="/imports" element={<ImportsPage />} />
        <Route path="/imports/new" element={<ImportWizardPage />} />
        <Route path="/imports/:id" element={<ImportRunPage />} />
        <Route path="/account/profile" element={<ProfileSettingsPage />} />
        <Route
          path="/account/notifications"
          element={<NotificationSettingsPage />}
        />
        <Route
          path="/account/automation"
          element={<AutomationSettingsPage />}
        />
        <Route path="/account/platforms" element={<PlatformSettingsPage />} />
        <Route
          path="/account/subscription"
          element={<SubscriptionSettingsPage />}
        />
        <Route path="/account/usage" element={<UsageSettingsPage />} />
        <Route path="/account/data" element={<DataSettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppShell>
  );
}

function OpsLayout() {
  return (
    <OpsShell>
      <Routes>
        <Route index element={<OpsDashboard />} />
        <Route
          path="applications"
          element={<OpsListPage kind="applications" />}
        />
        <Route path="workspaces" element={<OpsListPage kind="workspaces" />} />
        <Route path="workspaces/:id" element={<OpsWorkspaceDetailPage />} />
        <Route path="subscriptions" element={<OpsSubscriptionsPage />} />
        <Route path="usage" element={<OpsUsagePage />} />
        <Route path="tasks" element={<OpsListPage kind="tasks" />} />
        <Route path="tasks/:id" element={<OpsTaskDetailPage />} />
        <Route path="errors" element={<OpsListPage kind="errors" />} />
        <Route
          path="dependencies"
          element={<OpsListPage kind="dependencies" />}
        />
        <Route
          path="diagnostics"
          element={<OpsListPage kind="diagnostics" />}
        />
        <Route
          path="announcements"
          element={<OpsListPage kind="announcements" />}
        />
        <Route path="audit" element={<OpsListPage kind="audit" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </OpsShell>
  );
}

function NotFound() {
  const navigate = useNavigate();
  return (
    <section className="not-found">
      <Icon name="warning" size={32} />
      <h1>页面不存在</h1>
      <p>这个原型入口可能已经调整，当前状态和输入没有丢失。</p>
      <Button tone="primary" onClick={() => navigate("/review")}>
        返回页面索引
      </Button>
    </section>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/review" replace />} />
      <Route path="/review" element={<ReviewHub />} />
      <Route path="/review/stories" element={<StoriesReviewPage />} />
      <Route
        path="/review/intermediate-results"
        element={<IntermediateCoveragePage />}
      />
      <Route path="/components" element={<ComponentsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/ops/login" element={<LoginPage ops />} />
      <Route path="/ops/*" element={<OpsLayout />} />
      <Route path="/*" element={<UserLayout />} />
    </Routes>
  );
}
