const ContentBox = ({ data }) => {
  const { title, introParagraph, mission, vision, values } = data;

  return (
    <div className="bg-gray-900 rounded-3xl p-8 md:p-12 max-w-7xl mx-auto shadow-2xl max-h-[calc(100vh-8rem)] overflow-y-auto">
      {/* Main Title */}
      <h1 className="text-3xl md:text-4xl text-text-primary mb-4">
        {title}
      </h1>
      
      {/* Decorative Underline */}
      <div className="w-32 h-2 bg-accent-light-blue mb-6 rounded-sm"></div>
      
      {/* Introductory Paragraph */}
      <p className="text-text-primary text-base md:text-lg mb-8 leading-relaxed">
        {introParagraph}
      </p>
      
      {/* Content Sections */}
      <div className="space-y-8">
        {/* Mission Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
            {mission.title}
          </h2>
          <p className="text-text-primary text-base md:text-lg leading-relaxed">
            {mission.text}
          </p>
        </div>
        
        {/* Vision Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-3">
            {vision.title}
          </h2>
          <p className="text-text-primary text-base md:text-lg leading-relaxed">
            {vision.text}
          </p>
        </div>
        
        {/* Values Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-4">
            {values.title}
          </h2>
          <ul className="space-y-3">
            {values.list.map((value, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent-blue rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-text-primary text-base md:text-lg leading-relaxed">
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentBox;
