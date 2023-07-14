import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './FileDropZone.module.css';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

/**
 * Component with a file drop zone with upload functionality and file preview.
 * useDropZone hook used to handle file dropping and selection.
 * Credit to https://react-dropzone.org/#!/Examples.
 * @param {Funciton} onFileChange - A callback fucntion that will be called when a file is dropped or uploaded inthe dropzone.
 * @returns {JSX.Element} - A JSX element that contains the FileDropZone component used to drop image files.
 */
export default function FileDropZone(props) {
  const [files, setFiles] = useState([]);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: { 'image/jpeg': [], 'image/png': [] },
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
      props.onFileChange(acceptedFiles);
    },
  });

  // thumbnail preview of uploaded image
  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          className={styles.previewImg}
          src={file.preview}
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  const acceptedFileItems = acceptedFiles.map((file) => (
    <p className={styles.uploadedfileText}>{file.path}</p>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <div className={styles.dropBox}>
          {/* Display drop zone if no file has been uploaded */}
          <div
            style={{ display: acceptedFiles.length == 0 ? '' : 'none' }}
            className={styles.uploadView}>
            <input {...getInputProps()} />
            <ImageRoundedIcon className={styles.photoIcon} />
            <p style={{ color: '#808080' }}>Upload an image *</p>
          </div>
          {/* Display preview if a file has been uploaded */}
          <div
            style={{ display: acceptedFiles.length == 0 ? 'none' : '' }}
            className={styles.uploadedView}>
            <input {...getInputProps()} />
            {thumbs}
            {acceptedFileItems}
            <ClearRoundedIcon className={styles.closeIcon} />
          </div>
        </div>
      </div>
    </section>
  );
}
