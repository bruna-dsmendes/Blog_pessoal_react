import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import FormTema from '../formtema/FormTema';

function ModalTema({ onSuccess }: { onSuccess: () => void }) {
  return (
    <>
      <Popup
        trigger={
          <button
            className='rounded-full bg-accent hover:bg-accent-dark text-white text-sm font-medium px-4 py-1.5 transition-colors'>
            Novo tema
          </button>
        }
        modal
        contentStyle={{
          borderRadius: '0.75rem',
          padding: '0',
          width: '90vw',
          maxWidth: '420px'
        }}
      >
        <FormTema onSuccess={onSuccess} />
      </Popup>
    </>
  );
}

export default ModalTema;
