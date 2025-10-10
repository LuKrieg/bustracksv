import Header from '../../layout/Header';
import ContentBox from '../../layout/ContentBox';
import { aboutData } from '../../../data/aboutData';

const AboutPage = () => {
  return (
    <div 
      className="min-h-screen relative"
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
      <main className="relative z-10 w-full px-8 py-12">
        <ContentBox data={aboutData} />
      </main>
    </div>
  );
};

export default AboutPage;
