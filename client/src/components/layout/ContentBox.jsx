const ContentBox = ({ data }) => {
  const { title, introParagraph, mission, vision, values } = data;

  return (
    <div className="bg-gray-900 rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl">
      {/* Main Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
        {title}
      </h1>
      
      {/* Decorative Underline */}
      <div className="w-32 h-1 bg-accent-light-blue mb-8 rounded-sm"></div>
      
      {/* Introductory Paragraph */}
      <p className="text-text-primary text-lg mb-12 leading-relaxed">
        {introParagraph}
      </p>
      
      {/* Content Sections */}
      <div className="space-y-10">
        {/* Mission Section */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {mission.title}
          </h2>
          <p className="text-text-primary text-lg leading-relaxed">
            {mission.text}
          </p>
        </div>
        
        {/* Vision Section */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">
            {vision.title}
          </h2>
          <p className="text-text-primary text-lg leading-relaxed">
            {vision.text}
          </p>
        </div>
        
        {/* Values Section */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            {values.title}
          </h2>
          <ul className="space-y-4">
            {values.list.map((value, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent-blue rounded-full mt-3 flex-shrink-0"></div>
                <span className="text-text-primary text-lg leading-relaxed">
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
