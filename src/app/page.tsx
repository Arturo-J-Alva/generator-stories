export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-blue-100 to-pink-100 p-6">
      <main className="max-w-4xl mx-auto py-8">
        <h1 className="text-5xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 drop-shadow-md">
          🧙‍♂️ Generador de cuentos infantiles 📚
        </h1>
        
        <div className="space-y-8 px-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg">
              <label htmlFor="theme" className="block text-2xl font-medium text-purple-700 mb-4">
                🎭 Elige un tema:
              </label>
              <select 
                id="theme" 
                name="theme"
                className="w-full p-4 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 text-lg"
              >
                <option value="divertido">😄 Divertido</option>
                <option value="dormir">🌙 Para dormir</option>
                <option value="emocionante">🚀 Emocionante</option>
                <option value="educativa">🔍 Educativa</option>
              </select>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-teal-400 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg">
              <label htmlFor="storyPrompt" className="block text-2xl font-medium text-purple-700 mb-4">
                💭 Describe tu cuento:
              </label>
              <textarea
                id="storyPrompt"
                name="storyPrompt"
                rows={5}
                className="w-full p-4 rounded-lg border-2 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 text-lg"
                placeholder="Escribe sobre qué quieres que sea tu cuento..."
              ></textarea>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <button
              type="submit"
              className="inline-block px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 hover:scale-105"
            >
              🪄 ¡Generar Cuento! 🦄
            </button>
          </div>

          <div className="relative mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-orange-600 mb-4">📖 Ejemplo de Cuento: La Aventura de Luna 🐢</h2>
              <div className="prose prose-lg">
                <p>
                  Había una vez una pequeña tortuga llamada Luna 🐢 que soñaba con explorar el océano 🌊. Aunque sus amigos le decían que era imposible para una tortuga tan pequeña, Luna estaba decidida a cumplir su sueño.
                </p>
                <p>
                  Un día, Luna encontró una concha mágica ✨ en la orilla. &quot;Si crees en ti misma, todo es posible&quot;, susurró la concha. Con valentía, Luna se adentró en el agua.
                </p>
                <p>
                  Durante su viaje, Luna hizo nuevos amigos: un pez payaso muy gracioso 🐠, una sabia estrella de mar ⭐ y un delfín veloz 🐬. Juntos exploraron arrecifes de colores, grutas misteriosas y bailaron con las medusas luminosas.
                </p>
                <p>
                  Al regresar a casa, Luna ya no era la misma. Había aprendido que con amistad y valentía, hasta el sueño más grande puede hacerse realidad. 🌈
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
