import './App.css';
import { useFile } from './hooks/useFile';
import { Resumen } from './Resumen';
import loadingGif from './assets/loading.gif';

function App() {
    const { getRootProps, getInputProps, handleSubmit, acceptedFiles, generatedText, loading } = useFile();

    return (
        <>
            {loading ? (
                <div className="loading">
                    <img src={loadingGif} alt="Loading..." />
                    <p>Generating summary, please wait...</p>
                </div>
            ) : generatedText ? (
                <Resumen text={generatedText} />
            ) : (
                <>
                    <h1>PDF RESUMMER</h1>
                    <form onSubmit={handleSubmit}>
                        <div {...getRootProps()} className='container'>
                            <input {...getInputProps()} />
                            <p>DRAG AND DROP PDF ONLY</p>
                        </div>
                        {acceptedFiles[0] && <p>{acceptedFiles[0].name}</p>}
                        <button type="submit">RESUME</button>
                    </form>
                </>
            )}
        </>
    );
}

export default App;
