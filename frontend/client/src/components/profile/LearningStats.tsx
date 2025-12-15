/**
 * Learning Stats Component
 * Displays user learning statistics and progress
 */
const LearningStats = () => {
  const stats = [
    {
      title: 'Current Streak',
      value: '7 days'
    },
    {
      title: 'Total Practice Hours',
      value: '25 hours'
    },
    {
      title: 'Completed Modules',
      value: '12 modules'
    }
  ];

  return (
    <section>
      <div className="flex h-[60px] flex-col items-start w-full box-border pt-5 pb-3 px-4 max-sm:pt-4 max-sm:pb-2 max-sm:px-2">
        <h3 className="w-full text-[#0D121C] text-[22px] font-bold leading-7">
          Learning History
        </h3>
      </div>
      
      <div className="flex items-start content-start gap-4 w-full flex-wrap box-border p-4 max-md:flex-col max-sm:p-2">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex min-w-[158px] flex-col items-start gap-2 flex-[1_0_0] border p-6 rounded-xl border-solid border-[#CCD9EB] max-md:min-w-full"
          >
            <div className="flex flex-col items-start w-full">
              <h4 className="w-full text-[#0D121C] text-base font-medium leading-6">
                {stat.title}
              </h4>
            </div>
            <div className="flex flex-col items-start w-full">
              <p className="w-full text-[#0D121C] text-2xl font-bold leading-[30px]">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningStats;

