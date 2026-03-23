import React from 'react';
import Modal from 'react-modal';

const PetAdoptionModal = ({
  isOpen,
  onClose,
  selectedPet,
  user,
  formData,
  setFormData,
  onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    className="bg-white p-8 rounded max-w-lg mx-auto mt-20 shadow-lg relative"
    overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    {selectedPet && (
      <>
        <h2 className="text-2xl font-bold mb-4 text-center text-orange-500">
          Adopt {selectedPet.name}
        </h2>
        <img
          src={selectedPet.img}
          alt={selectedPet.name}
          className="w-32 h-32 mx-auto rounded mb-4"
        />
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold">User Name</label>
            <input
              value={user.name}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Email</label>
            <input
              value={user.email}
              disabled
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Phone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="input input-bordered w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={e =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              className="input input-bordered w-full"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 w-full py-2 text-white font-semibold rounded hover:bg-orange-700"
          >
            Submit Adoption Request
          </button>
        </form>
      </>
    )}
  </Modal>
);

export default PetAdoptionModal;
