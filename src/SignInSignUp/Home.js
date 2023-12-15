import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'filepond/dist/filepond.min.css';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { v4 as uuidv4 } from 'uuid';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode);

const Home = () => {
    const [profilePic, setProfilePic] = useState([]);
    const [name, setName] = useState("");
    const [allData, setAllData] = useState([]);
    const [editItem, setEditItem] = useState(null);
    const [editedName, setEditedName] = useState("");
    const [editedProfilePic, setEditedProfilePic] = useState([]);

    const logout = () => {
        localStorage.removeItem("signUp");
        window.location.reload();
    };

    const deleteAccount = () => {
        localStorage.clear();
        window.location.reload();
    };

    const handleAdd = () => {
        if (name && profilePic[0]) {
            const nameObj = {
                id: uuidv4(),
                name: name,
                images: profilePic.map(file => URL.createObjectURL(file.file)),
            };
            setAllData([...allData, nameObj]);
            setProfilePic([]);
            setName("");
        } else {
            alert("Enter All Fields");
        }
    };

    const handleDelete = (id) => {
        const updatedData = allData.filter(item => item.id !== id);
        setAllData(updatedData);
    };

    const handleEdit = (item) => {
        setEditItem(item);
        setEditedName(item.name);
        setEditedProfilePic(item.images.map(url => ({ source: url, options: { type: 'local' } })));
    };

    const handleSaveEdit = () => {
        const updatedData = allData.map(item =>
            item.id === editItem.id
                ? { ...item, name: editedName, images: editedProfilePic.map(file => URL.createObjectURL(file.file)) }
                : item
        );
        setAllData(updatedData);
        setEditItem(null);
    };

    const handleDragEnd = (result) => {
        if (!result.destination) {
            return;
        }

        const reorderedData = Array.from(allData);
        const [movedItem] = reorderedData.splice(result.source.index, 1);
        reorderedData.splice(result.destination.index, 0, movedItem);

        setAllData(reorderedData);
    };

    return (
        <>
            <h1>Home</h1>
            <button onClick={logout} className='logout'>
                LogOut
            </button>
            <button onClick={deleteAccount} className='delete'>
                Delete
            </button>
            <div className='main-conatiner'>
                <div className='col-md-12 uplode-conatiner' style={{ display: "flex" }}>
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter an Image Name'
                    />
                    <div className='mb-3 mt-2 col-md-5'>
                        <label>
                            <strong>Profile Picture</strong>
                        </label>
                        <FilePond
                            files={profilePic}
                            onupdatefiles={setProfilePic}
                            allowReorder={true}
                            allowReplace={true}
                            allowMultiple={false}
                            maxFiles={1}
                            credits={false}
                            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                        />
                    </div>
                    <button style={{ background: "red" }} onClick={handleAdd}>
                        Add
                    </button>
                </div>
            </div>
            <div style={{ marginTop: "12px" }}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId='my-unique-droppable'>
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={{
                                    maxWidth: "360px",
                                    background: "white",
                                    display: "flex",
                                    flexDirection: "column",
                                    marginTop: "19px",
                                    border: "1px solid #000",
                                    padding: "1rem",
                                    maxWidth: "500px",
                                    margin: "0px auto",
                                }}
                            >
                                {allData &&
                                    allData?.map((item, index) => (
                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className='add-container'
                                                >
                                                    {item?.images?.map((image, i) => (
                                                        <img
                                                            key={i}
                                                            src={image}
                                                            alt={`Image ${i}`}
                                                            style={{ width: "3rem", height: "3rem" }}
                                                        />
                                                    ))}
                                                    <h1>{item.name}</h1>
                                                    <button style={{ marginRight: "8px" }} onClick={() => handleEdit(item)}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            {editItem && (
                <div className='edit-modal'>
                    <h2>Edit Item</h2>
                    <label>
                        <strong>Edited Name</strong>
                    </label>
                    <input
                        type='text'
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder='Enter an Image Name'
                    />
                    <label>
                        <strong>Edited Profile Picture</strong>
                    </label>
                    <FilePond
                        files={editedProfilePic}
                        onupdatefiles={setEditedProfilePic}
                        allowReorder={true}
                        allowReplace={true}
                        allowMultiple={false}
                        maxFiles={1}
                        credits={false}
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                    <button onClick={handleSaveEdit}>Save</button>
                    <button onClick={() => setEditItem(null)}>Cancel</button>
                </div>
            )}
        </>
    );
};

export default Home;