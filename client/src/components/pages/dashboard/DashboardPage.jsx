import Header from '../../layout/Header';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      <main className="w-full px-8 py-12">
        <p className="text-text-primary text-2xl">Dashboard</p>
      </main>
    </div>
  );
};

export default DashboardPage;
