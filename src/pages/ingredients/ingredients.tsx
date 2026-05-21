import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal, IngredientDetails } from '@components';

export const Ingredients: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleCloseModal = () => {
    navigate(-1);
  };

  return (
    <>
      {id && (
        <Modal title='Детали ингредиента' onClose={handleCloseModal}>
          <IngredientDetails />
        </Modal>
      )}
    </>
  );
};
