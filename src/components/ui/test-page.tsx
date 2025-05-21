export function TestPage() {
  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-black dark:text-white">Test Page</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        This is a test page to check if we can see content on the screen.
      </p>
      <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-semibold text-black dark:text-white">Content Block</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          If you can see this text, then the styling is working properly.
        </p>
      </div>
    </div>
  );
} 