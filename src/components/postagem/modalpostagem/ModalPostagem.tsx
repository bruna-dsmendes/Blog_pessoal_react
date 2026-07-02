import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import FormPostagem from '../formpostagem/FormPostagem';

function ModalPostagem() {
  return (
    <>
      <Popup
        trigger={
          <button
            className='border border-sky-400 text-sky-600 rounded px-4 py-2 hover:bg-sky-100 hover:text-sky-800 transition-colors'>
            Nova Postagem
          </button>
        }
        modal
        contentStyle={{
          borderRadius: '1rem',
          paddingBottom: '2rem'
        }}
      >
        <FormPostagem />
      </Popup>
    </>
  );
}

export default ModalPostagem;