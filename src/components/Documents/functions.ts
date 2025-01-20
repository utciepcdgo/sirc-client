/**
 * Funciones para generar documentos PDF usando la librería pdf-lib.js
 */
import {PDFDocument} from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import {currentDateToText, defineAgeRange, defineSex} from './utils'

// Formato 1 - Discapacidad permanente
export async function disabilityPdf(registration: object) {
    const templatePdfUrl = 'https://s3.us-east-1.amazonaws.com/static-test.appsiepcdurango.mx/sirc_template_forms/FORMATO_1_FORM.pdf'
    const templatePdfBytes = await fetch(templatePdfUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(templatePdfBytes)

    const form = pdfDoc.getForm()

    // Get pages
    const pages = pdfDoc.getPages()
    // Get the first page
    const firstPage = pages[0]
    // Get the width and height of the first page
    const {width, height} = firstPage.getSize()
    // Draw Date text on the first page
    firstPage.drawText(currentDateToText(), {
        x: 300,
        y: height - 100,
        size: 10
    })

    // Check the corresponding sex checkbox
    form.getCheckBox(defineSex(registration)).check()

    // Fill the name field
    form.getTextField('name').setText(registration.name + ' ' + registration.first_name + ' ' + registration.second_name)

    // Lock the form
    form.flatten()

    // Save the PDF to a Uint8Array
    return await pdfDoc.save()
}

// Formato 2 - Diversidad sexual.
export async function diversityPdf(registration: object) {
    const templatePdfUrl = 'https://s3.us-east-1.amazonaws.com/static-test.appsiepcdurango.mx/sirc_template_forms/FORMATO_2_FORM.pdf'
    const templatePdfBytes = await fetch(templatePdfUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(templatePdfBytes)

    const form = pdfDoc.getForm()

    // Get pages
    const pages = pdfDoc.getPages()
    // Get the first page
    const firstPage = pages[0]
    // Get the width and height of the first page
    const {width, height} = firstPage.getSize()
    // Write the current date on the first page
    firstPage.drawText(currentDateToText(), {
        x: 300,
        y: height - 100,
        size: 10
    })

    // Map checkboxes on file template
    const gendersOnFile = {1: {'id': 1, 'name': 'Homosexual', 'field': 'gender.homosexual'}, 2: {'id': 8, 'name': 'Pansexual', 'field': 'gender.pansexual'}, 3: {'id': 3, 'name': 'Bisexual', 'field': 'gender.bisexual'}, 4: {'id': 4, 'name': 'Transexual', 'field': 'gender.transexual'}, 5: {'id': 10, 'name': 'Transgénero', 'field': 'gender.transgenero'}, 6: {'id': 12, 'name': 'Travesti', 'field': 'gender.travesti'}, 7: {'id': 7, 'name': 'Intersexual', 'field': 'gender.intersexual'}}

    // Compare gendersOnFile[x].id with registration.gender.id, if they match, check the corresponding checkbox
    // If the id doesn't match, check the 'Otro' checkbox and write the name on the corresponding field.
    // Comparar recursivamente gendersOnFile con registration.gender.id
    const genderMatch = Object.values(gendersOnFile).find(gender => gender.id === registration.gender.id);

    if (genderMatch) {
        // Check the corresponding box if match
        form.getCheckBox(genderMatch.field).check();
    } else {
        // Check the box 'Otro' and write the gender name on the corresponding field
        form.getCheckBox('gender.x').check();
        form.getTextField('gender.other').setFontSize(8)
        form.getTextField('gender.other').setText(registration.gender.name);
    }

    // Check the corresponding sex checkbox
    form.getCheckBox(defineSex(registration)).check()

    // Fill the name field
    form.getTextField('name').setFontSize(10)
    form.getTextField('name').setText(registration.name + ' ' + registration.first_name + ' ' + registration.second_name)

    // Lock the form
    form.flatten()

    // Save the PDF to a Uint8Array
    return await pdfDoc.save()
}

// Formato 3 - Migrante
export async function migrantPdf(registration: object) {
    const templatePdfUrl = 'https://s3.us-east-1.amazonaws.com/static-test.appsiepcdurango.mx/sirc_template_forms/FORMATO_3_FORM.pdf'
    const templatePdfBytes = await fetch(templatePdfUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(templatePdfBytes)

    const form = pdfDoc.getForm()

    // Get pages
    const pages = pdfDoc.getPages()
    // Get the first page
    const firstPage = pages[0]
    // Get the width and height of the first page
    const {width, height} = firstPage.getSize()
    // Draw Date text on the first page
    firstPage.drawText(currentDateToText(), {
        x: 300,
        y: height - 100,
        size: 10
    })

    // Evaluate residence numbers.
    const local_residence_exterior_number = registration.residence.outside_number == 0 ? ' ' : (' ' + registration.residence.outside_number + ' ')
    const local_residence_interior_number = registration.residence.inside_number == 0 ? ' ' : (' Int. ' + registration.residence.inside_number + ' ');
    // Get the residence text field and fill it
    form.getTextField('residence.local').setFontSize(8)
    form.getTextField('residence.local').setText(registration.residence.street + local_residence_exterior_number + local_residence_interior_number + ', Col/Fracc. ' +
        registration.residence.colony + ', ' + registration.residence.city + ', ' + registration.residence.municipality.toUpperCase() + ', ' +
        registration.residence.state.abbreviation + ', C.P. ' + registration.residence.postal_code)

    // Due to the Migrant information isn't obligatory, we need to check if the registration has the migrant object
    form.getTextField('residence.foreign').setFontSize(8)
    form.getTextField('residence.foreign').setText(registration?.migrant?.address + ' ' + registration?.migrant?.zip_code + ' ' + registration?.migrant?.country?.alpha3.toUpperCase())

    // Check the corresponding sex checkbox
    form.getCheckBox(defineSex(registration)).check()

    // Fill the name field
    form.getTextField('name').setFontSize(10)
    form.getTextField('name').setText(registration.name + ' ' + registration.first_name + ' ' + registration.second_name)

    // Lock the form
    form.flatten()

    // Save the PDF to a Uint8Array
    return await pdfDoc.save()
}

// Formato 4 - Indígena
export async function indigenousPdf(registration: object) {
    const templatePdfUrl = 'https://s3.us-east-1.amazonaws.com/static-test.appsiepcdurango.mx/sirc_template_forms/FORMATO_4_FORM.pdf'
    const templatePdfBytes = await fetch(templatePdfUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(templatePdfBytes)

    const form = pdfDoc.getForm()

    // Get pages
    const pages = pdfDoc.getPages()
    // Get the first page
    const firstPage = pages[0]
    // Get the width and height of the first page
    const {width, height} = firstPage.getSize()
    // Draw Date text on the first page
    firstPage.drawText(currentDateToText(), {
        x: 300,
        y: height - 100,
        size: 10
    })

    // Fill the name field
    form.getTextField('name').setFontSize(10)
    form.getTextField('name').setText(registration.name + ' ' + registration.first_name + ' ' + registration.second_name)

    // Lock the form
    form.flatten()

    // Save the PDF to a Uint8Array
    return await pdfDoc.save()
}

// Formato 6 - Aceptación de candidatura
export async function candidacyPdf(registration: object) {
    const templatePdfUrl = 'https://s3.us-east-1.amazonaws.com/static-test.appsiepcdurango.mx/sirc_template_forms/FORMATO_6_FORM.pdf'
    const templatePdfBytes = await fetch(templatePdfUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(templatePdfBytes)

    const form = pdfDoc.getForm()

    // Get pages
    const pages = pdfDoc.getPages()
    // Get the first page
    const firstPage = pages[0]
    // Get the width and height of the first page
    const {width, height} = firstPage.getSize()
    // Draw Date text on the first page
    firstPage.drawText(currentDateToText(), {
        x: 300,
        y: height - 100,
        size: 10
    })

    // Fill the name field
    form.getTextField('name').setFontSize(10)
    form.getTextField('name').setText(registration.name + ' ' + registration.first_name + ' ' + registration.second_name)
    // Fill the candidacy field
    form.getTextField('candidacy').setText(registration.name + ' ' + registration.first_name + ' ' + registration.second_name)
    // Fill the party or coalition field
    form.getTextField('party').setText(registration.coalition.is_assigned ? registration.coalition.name : registration.entity.name)
    // Fill the postulation field
    form.getTextField('postulation').setText(registration.postulation.name)
    // Fill the position field
    form.getTextField('position').setText(registration.position.name)

    // Lock the form
    form.flatten()

    // Save the PDF to a Uint8Array
    return await pdfDoc.save()
}


// Formato 8 - Reelección
export async function reelectionPdf(registration: object) {
    const templatePdfUrl = 'https://s3.us-east-1.amazonaws.com/static-test.appsiepcdurango.mx/sirc_template_forms/FORMATO_8_FORM.pdf'
    const templatePdfBytes = await fetch(templatePdfUrl).then(res => res.arrayBuffer())

    const arialNarrowBoldUrl = 'https://s3.us-east-1.amazonaws.com/static-test.appsiepcdurango.mx/sirc_template_forms/ARIALN.TTF'
    const arialNarrowBoldBytes = await fetch(arialNarrowBoldUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(templatePdfBytes)
    pdfDoc.registerFontkit(fontkit)
    const arialNarrowBold = await pdfDoc.embedFont(arialNarrowBoldBytes)

    const form = pdfDoc.getForm()

    // Get pages
    const pages = pdfDoc.getPages()
    // Get the first page
    const firstPage = pages[0]
    // Get the width and height of the first page
    const {width, height} = firstPage.getSize()
    // Draw Date text on the first page
    firstPage.drawText(currentDateToText(), {
        x: 304,
        y: height - 112,
        size: 10
    })

    let firstParagraph = `De conformidad con lo dispuesto por los artículos 149 de la Constitución Política del Estado Libre y Soberano de Durango; 10, numeral 4, 187, numeral 1, fracción VIII de la Ley de Instituciones y Procedimientos Electorales para el Estado de Durango; 22  y 23 de los Lineamientos para el Registro de Candidaturas para la Renovación de los Ayuntamientos del Estado de Durango, para el Proceso Electoral Local 2024 – 2025 del Instituto Electoral y de Participación Ciudadana del Estado de Durango, especifico el periodo para el que he sido electo (a) en el cargo de ${registration.postulation.name}, conforme a lo siguiente:`
    let formattedFont = arialNarrowBold.widthOfTextAtSize(firstParagraph, 12)

    firstPage.drawText(firstParagraph, {
        x: 83,
        y: 600,
        size: 12,
        font: arialNarrowBold,
        lineHeight: 13,
        maxWidth: 440
    });

    let secondParagraph = `Me postula el mismo partido o un partido integrante de la Coalición ${registration.coalition.is_assigned ? registration.coalition.name : registration.entity.name} conforme lo mandata la normativa aplicable`
    firstPage.drawText(secondParagraph, {
        x: 121,
        y: 350,
        size: 12,
        font: arialNarrowBold,
        lineHeight: 13,
        maxWidth: 400
    });

    // Fill the name field
    form.getTextField('name').setFontSize(10)
    form.getTextField('name').setText(registration.name + ' ' + registration.first_name + ' ' + registration.second_name)
    // Fill the party or coalition field
    form.getTextField('party').setText(registration.coalition.is_assigned ? registration.coalition.name : registration.entity.name)
    // Fill the postulation field
    form.getTextField('postulation').setText(registration.postulation.name)

    // Lock the form
    form.flatten()

    // Save the PDF to a Uint8Array
    return await pdfDoc.save()
}

// Formato 10 - Red de Candidatas
export async function amceePdf(registration: object) {
    const templatePdfUrl = 'https://s3.us-east-1.amazonaws.com/static-test.appsiepcdurango.mx/sirc_template_forms/FORMATO_10_FORM.pdf'
    const templatePdfBytes = await fetch(templatePdfUrl).then(res => res.arrayBuffer())

    const pdfDoc = await PDFDocument.load(templatePdfBytes)

    const form = pdfDoc.getForm()

    // Get pages
    const pages = pdfDoc.getPages()
    // Get the first page
    const firstPage = pages[0]
    const secondPage = pages[1]
    const thirdPage = pages[2]
    // Get the width and height of the first page
    const {width, height} = firstPage.getSize()


    // Fill the name field
    form.getTextField('name').setFontSize(10)
    form.getTextField('name').setText(registration.name + ' ' + registration.first_name + ' ' + registration.second_name)
    // Fill the postulation field
    // Fill the party or coalition field
    form.getTextField('party').setText(registration.coalition.is_assigned ? registration.coalition.name : registration.entity.name)
    // Fill the postulation field
    if (registration.compensatory.id == 3) {
        form.getTextField('compensatory').setText(registration.gender.name)
    }

    // Calculate the age using the birthdate
    const birthdate = new Date(registration.birthplace.birth)
    const today = new Date()
    const age = today.getFullYear() - birthdate.getFullYear()

    form.getTextField(defineAgeRange(age)).setText('X')


    // Lock the form
    form.flatten()

    // Save the PDF to a Uint8Array
    return await pdfDoc.save()
}
