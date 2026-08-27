import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-10 text-black sm:px-8">

      <div className="mx-auto max-w-6xl">

        {/* Hero */}
        <section className="mx-auto max-w-4xl pt-16 text-center">

          <div className="mb-6 inline-block rounded-full border-2 border-black bg-[#e5d1ff] px-5 py-2 font-semibold shadow-[3px_3px_0px_#000]">
            ABOUT SHAREEZY
          </div>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Sharing files,
            <br />
            <span className="underline decoration-4 underline-offset-8">
              made simple.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 sm:text-xl">
            ShareEzy is a simple file transferring platform that lets you
            share files anytime, anywhere — instantly, securely, and without
            unnecessary limits.
          </p>
        </section>

        {/* What is ShareEzy */}
        <section className="mt-20 grid gap-8 md:grid-cols-2">

          <div className="rounded-3xl border-2 border-black bg-[#e5d1ff] p-8 shadow-[6px_7px_0px_#000] transition-transform duration-200 hover:-translate-y-1">
            <div className="mb-5 text-4xl">📁</div>

            <h2 className="mb-4 text-3xl font-bold">
              What is ShareEzy?
            </h2>

            <p className="text-lg leading-8">
              ShareEzy makes file sharing quick and effortless. Create a
              room, share it with others, and transfer your files without
              complicated setup.
            </p>
          </div>

          <div className="rounded-3xl border-2 border-black bg-[#b5f3cb] p-8 shadow-[6px_7px_0px_#000] transition-transform duration-200 hover:-translate-y-1">
            <div className="mb-5 text-4xl">⚡</div>

            <h2 className="mb-4 text-3xl font-bold">
              Why ShareEzy?
            </h2>

            <p className="text-lg leading-8">
              No unnecessary complexity. ShareEzy focuses on making file
              transfers fast, accessible, and easy to understand for
              everyone.
            </p>
          </div>

        </section>

        {/* Features */}
        <section className="mt-20">

          <h2 className="mb-10 text-center text-4xl font-bold">
            Built for easy sharing
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="rounded-2xl border-2 border-black bg-white p-7 shadow-[4px_5px_0px_#000] transition-all duration-200 hover:-translate-y-1">
              <div className="mb-4 text-3xl">🚀</div>

              <h3 className="mb-2 text-xl font-bold">
                Fast
              </h3>

              <p className="leading-7 text-gray-700">
                Transfer files quickly with a simple and straightforward
                sharing experience.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-black bg-white p-7 shadow-[4px_5px_0px_#000] transition-all duration-200 hover:-translate-y-1">
              <div className="mb-4 text-3xl">🔐</div>

              <h3 className="mb-2 text-xl font-bold">
                Secure
              </h3>

              <p className="leading-7 text-gray-700">
                Keep your file-sharing experience private and controlled.
              </p>
            </div>

            <div className="rounded-2xl border-2 border-black bg-white p-7 shadow-[4px_5px_0px_#000] transition-all duration-200 hover:-translate-y-1">
              <div className="mb-4 text-3xl">✨</div>

              <h3 className="mb-2 text-xl font-bold">
                Simple
              </h3>

              <p className="leading-7 text-gray-700">
                A clean interface that makes sharing files easy for everyone.
              </p>
            </div>

          </div>
        </section>

        {/* Developer */}
        <section className="mt-20 rounded-3xl border-2 border-black bg-[#e5d1ff] p-8 shadow-[6px_7px_0px_#000] sm:p-12">

          <p className="mb-3 text-sm font-bold tracking-[0.25em]">
            BUILT BY
          </p>

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">

            <div className="max-w-2xl">

              <h2 className="text-4xl font-bold sm:text-5xl">
                Tanmay Mangale
              </h2>

              <p className="mt-5 text-lg leading-8">
                A developer passionate about building scalable applications,
                exploring system design, AI, and modern web technologies.
              </p>

            </div>

            <a
              href="https://github.com/tanmay-mangale"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-3 rounded-xl border-2 border-black bg-white px-6 py-3 font-bold shadow-[4px_4px_0px_#000] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.54 2.87 8.39 6.84 9.75.5.1.68-.22.68-.49v-1.72c-2.78.62-3.37-1.38-3.37-1.38-.46-1.21-1.11-1.53-1.11-1.53-.91-.64.07-.63.07-.63 1.01.07 1.54 1.07 1.54 1.07.9 1.57 2.35 1.12 2.92.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75.1-.26.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.15 9.15 0 0 1 5.01 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.35 4.8-4.58 5.06.36.32.68.94.68 1.9v2.81c0 .27.18.6.69.49A10.27 10.27 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
              </svg>

              GitHub
            </a>

          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 text-center">

          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to share?
          </h2>

          <p className="mt-3 text-gray-700">
            Create a room and start sharing files.
          </p>

          <Link
            to="/"
            className="mt-7 inline-block rounded-xl border-2 border-black bg-[#b5f3cb] px-8 py-3 text-lg font-bold shadow-[4px_5px_0px_#000] transition-all duration-200 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]"
          >
            Start Sharing →
          </Link>

        </section>

      </div>
    </div>
  );
};

export default About;