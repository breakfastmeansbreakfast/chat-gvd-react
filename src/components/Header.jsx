import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'

function Header() {
  return (
    <header className="bg-primary-600 text-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <QuestionMarkCircleIcon className="h-8 w-8" />
          <h1 className="text-xl font-bold">Golden Valley AI Assistant</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a 
                href="https://github.com/breakfastmeansbreakfast/chat-gvd" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary-200 transition-colors"
              >
                GitHub
              </a>
            </li>
            <li>
              <a 
                href="#help" 
                className="hover:text-primary-200 transition-colors"
              >
                Help
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;