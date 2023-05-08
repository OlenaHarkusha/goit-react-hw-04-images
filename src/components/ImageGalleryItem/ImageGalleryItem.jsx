import { Modal } from 'components/Modal';
import { useState } from 'react';
import { GalleryItem, Image } from './ImageGalleryItem.styled';
import PropTypes from 'prop-types';

export const ImageGalleryItem = ({ picture, description, largeImage }) => {
  const [modal, setModal] = useState(false);

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  return (
    <GalleryItem>
      <Image src={picture} alt={description} onClick={openModal} />
      {modal && (
        <Modal
          onClose={closeModal}
          image={largeImage}
          description={description}
        />
      )}
    </GalleryItem>
  );
};

ImageGalleryItem.propTypes = {
  picture: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  largeImage: PropTypes.string.isRequired,
};
