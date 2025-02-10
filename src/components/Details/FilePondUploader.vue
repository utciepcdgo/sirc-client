<script setup>
import vueFilePond from "vue-filepond";
import axios from 'axios';

// Asegúrate de importar los complementos de FilePond si los usas
import 'filepond/dist/filepond.min.css';

// Import image preview plugin styles
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";

// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Propiedad del documento que se carga
const props = defineProps({
  document: Object,// Este objeto contiene el nombre del documento y otros detalles
  registration: Object,// Este objeto contiene el registro al que se asocia el documento
});

// Configuración de FilePond
const filePondServer = {
  // El método process se llama cada vez que se carga un archivo.
  process: (
      fieldName, // en este caso, el id del documento (por ejemplo, "acta_nacimiento")
      file,
      metadata,
      load,
      error,
      progress,
      abort,
      transfer,
      options
  ) => {
    // Paso 1: Solicitar a la API la URL prefirmada.
    // Puedes enviar información extra, por ejemplo el "fieldName" y datos del archivo.
    axios
        .post(import.meta.env.VITE_SIRC_API_URI + 'aws_s3_signed_url', {
          document: fieldName.replace(/\s+/g, '_').toUpperCase(),
          fileName: file.name,
          partyAcronym: (props.registration.coalition.is_assigned ? props.registration.coalition.acronym : props.registration.party.acronym),
          municipality: props.registration.municipality.name.toUpperCase(),
          contentType: file.type,
        })
        .then((response) => {
          // Supongamos que la API responde con { url: "https://s3.amazonaws.com/tu-bucket/archivo?firma=...", ... }
          const {url} = response.data;
          // Paso 2: Realizar la carga a S3 mediante un PUT.
          const xhr = new XMLHttpRequest();
          xhr.open('PUT', url);

          // Opcional: puedes establecer headers si S3 lo requiere (por ejemplo, Content-Type)
          xhr.setRequestHeader('Content-Type', file.type);

          // Notificar el progreso de la subida
          xhr.upload.onprogress = (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              // La subida fue exitosa.
              console.log('Archivo subido a S3:', response.data.key);
              axios
                  .post(import.meta.env.VITE_SIRC_API_URI + 'file', {
                    params: {
                      "filetype_id": props.document.id,               // The document id
                      "registration_id": props.registration.id, // The record/registration id
                      "format": file.type,                     // File format, hard-coded as "PDF" here
                      "url": response.data.key,                          // Send the S3 key (or you could send the full URL)
                    },
                  })
                  .then((apiResponse) => {
                    // Optionally handle the response from your registration API.
                    console.log("File info saved:", apiResponse.data);
                  })
                  .catch((apiError) => {
                    console.error("Error saving file info to registration:", apiError);
                  });
              // Puedes enviar como identificador la URL o cualquier dato que permita identificar el archivo en S3.
              load(url);
            } else {
              error('Error al subir el archivo a S3');
            }
          };

          xhr.onerror = () => {
            error('Error en la comunicación con S3');
          };

          xhr.send(file);

          // Devuelve una función para abortar la subida en caso de que sea necesario.
          return {
            abort: () => {
              xhr.abort();
              abort();
            },
          };
        })
        .catch(() => {
          error('Error al obtener la URL prefirmada');
        });
  },

  // Puedes implementar otros métodos (revert, fetch, restore) si lo requieres.
};

const FilePond = vueFilePond(
    FilePondPluginFileValidateType,
    FilePondPluginImagePreview
);

</script>

<template>
  <div>
    <h3>{{ document.name }}</h3>
    <file-pond
        :accepted-file-types="'image/*, application/pdf'"
        :allow-multiple="false"
        :label-idle="'Arrastra y suelta un archivo o haz clic para cargar'"
        :max-files="1"
        :name="document.name"
        :server="filePondServer"
        @addfile="handleFileUpload"
    />
  </div>
</template>