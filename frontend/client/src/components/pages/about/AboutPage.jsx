import Header from '../../layout/Header';
import ContentBox from '../../layout/ContentBox';
import { aboutData } from '../../../data/aboutData';

const AboutPage = () => {
  return (
    <div 
      className="h-screen relative flex flex-col"
      style={{
        backgroundImage: 'url(/fondo_info.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <main className="relative z-10 w-full px-8 flex-1 flex items-center justify-center">
        <ContentBox data={aboutData} />
      </main>
    </div>
  );
};

export default AboutPage;
