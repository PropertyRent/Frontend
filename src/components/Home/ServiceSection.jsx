export default function ServiceSection() {
  return (
    <section>
        <div className="container mx-auto py-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold mb-2">PropertyRent Services</h2>
            <p className="text-center text-lg md:text-xl text-gray-600 mb-8">We offer a range of services to help you find your perfect property.</p>
            <p className="text-center px-2 max-w-3xl text-gray-600 mb-8">Our management service covers end-to-end operations: proactive tenant sourcing and screening, lease administration, automated rent collection, coordinated repairs with vetted vendors, and transparent monthly financial statements. We act as your local partner to protect your asset and maximize returns.</p>
            <div className='flex justify-center gap-2 mt-4'>
                <button className="bg-white text-[var(--color-secondary)] border-2 border-[var(--color-secondary)] hover:border-[var(--color-secondary)] rounded-full hover:bg-[var(--color-secondary)] hover:text-white text-md md:text-xl py-2 px-4 cursor-pointer transition-colors">Management Services</button>
            </div>
        </div>
    </section>
  )
}
