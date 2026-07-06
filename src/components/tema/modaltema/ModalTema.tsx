import Popup from 'reactjs-popup';

import 'reactjs-popup/dist/index.css';
import FormTema from '../formtema/FormTema';

function ModalTema() {
  return (
    <>
      <Popup
        trigger={
          <button
            className='border border-sky-400 text-sky-600 rounded px-4 py-2 hover:bg-sky-100 hover:text-sky-800 transition-colors'>
            Cadastrar Tema
          </button>
        }
        modal
        contentStyle={{
          borderRadius: '1rem',
          paddingBottom: '2rem'
        }}
      >
        <FormTema />
      </Popup>
    </>
  );
}

export default ModalTema;
