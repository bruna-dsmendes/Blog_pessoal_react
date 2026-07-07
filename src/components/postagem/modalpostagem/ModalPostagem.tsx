import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import FormPostagem from '../formpostagem/FormPostagem';

function ModalPostagem({ onSuccess }: { onSuccess: () => void }) {
  return (
    <>
      <Popup
        trigger={
          <button
            className='rounded-full bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-1.5 transition-colors'>
            Escrever
          </button>
        }
        modal
        contentStyle={{
          borderRadius: '0.75rem',
          padding: '0',
          maxHeight: '85vh',
          overflowY: 'auto',
          width: '90vw',
          maxWidth: '720px'
        }}
      >
        <FormPostagem onSuccess={onSuccess} />
      </Popup>
    </>
  );
}

export default ModalPostagem;