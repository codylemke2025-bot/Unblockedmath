import { useState, useEffect } from 'react';
import { Gamepad2, Search, X, Maximize2, Play, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [games, setGames] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      if (Array.isArray(gamesData)) {
        setGames(gamesData);
      } else {
        console.error('Games data is not an array:', gamesData);
        setError('Failed to load games data.');
      }
    } catch (err) {
      console.error('Error loading games:', err);
      setError('An error occurred while loading games.');
    }
  }, []);

  const filteredGames = games.filter(game =>
    game.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFullScreen = () => {
    try {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        setIsFullScreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          setIsFullScreen(false);
        }
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Error</h1>
          <p className="text-zinc-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setSelectedGame(null)}
          >
            <div className="p-2 bg-emerald-500 rounded-lg">
              <Gamepad2 className="w-6 h-6 text-zinc-950" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">
              UNBLOCKED<span className="text-emerald-500">GAMES</span>
            </h1>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search games..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleFullScreen}
              className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-zinc-100"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Popular Games</h2>
                <span className="text-sm text-zinc-500">{filteredGames.length} games found</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <motion.div
                    key={game.id}
                    layoutId={game.id}
                    onClick={() => setSelectedGame(game)}
                    className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/50"
                  >
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-zinc-100">{game.title}</h3>
                        <p className="text-xs text-zinc-500">Web Game</p>
                      </div>
                      <div className="p-2 bg-zinc-800 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex p-4 bg-zinc-900 rounded-full mb-4">
                    <Search className="w-8 h-8 text-zinc-700" />
                  </div>
                  <p className="text-zinc-500">No games found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col h-[calc(100vh-10rem)]"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Back to Library</span>
                </button>
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold">{selectedGame.title}</h2>
                  <button
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative">
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allowFullScreen
                  allow="autoplay; fullscreen; pointer-lock"
                />
              </div>
              
              <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
                <p>Controls may vary by game. Use fullscreen for the best experience.</p>
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><Maximize2 className="w-3 h-3" /> Fullscreen Support</span>
                  <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" /> Controller Support</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-zinc-800 py-8 bg-zinc-950">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Gamepad2 className="w-5 h-5" />
            <span className="text-sm font-semibold">UNBLOCKED GAMES PORTAL</span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Unblocked Games. All rights reserved. 
            All games are property of their respective owners.
          </p>
          <div className="flex gap-6 text-xs text-zinc-500">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
