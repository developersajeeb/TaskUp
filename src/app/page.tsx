import Link from "next/link";

const Home = () => {

  return (
    <section className="mx-auto max-w-7xl py-14 md:py-32 px-4">
      <div>
        <div className="mb-4 md:mb-8 flex justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 dark:text-gray-200">
            Announcing our next round of funding.{' '}
            <a href="#" className="font-semibold text-indigo-600">
              <span aria-hidden="true" className="absolute inset-0" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-3xl md:text-6xl font-semibold tracking-tight text-balance text-gray-900 dark:text-white">
            Your Personal Task Management App for Seamless Organization
          </h1>
          <p className="mt-5 md:mt-8 text-lg text-pretty text-gray-500 dark:text-gray-300 sm:text-xl/8 max-w-3xl mx-auto">
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
            fugiat veniam occaecat.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <a href="#" className="text-sm/6 font-semibold text-gray-900 dark:text-white">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
