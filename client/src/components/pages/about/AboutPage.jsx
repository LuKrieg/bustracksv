import Header from '../../layout/Header';
import ContentBox from '../../layout/ContentBox';
import { aboutData } from '../../../data/aboutData';

const AboutPage = () => {
  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Background Image */}
      <img 
        src="/fondo_info.png" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="relative z-10 w-full px-6 md:px-8 flex-1 flex items-center justify-center py-4">
        <ContentBox data={aboutData} />
      </main>
    </div>
  );
};

export default AboutPage;
