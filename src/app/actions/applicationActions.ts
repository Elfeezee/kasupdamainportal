
'use server';

import { createSupabaseServerClient } from '@/lib/supabase/server';
import { v4 as uuidv4 } from 'uuid';
import { createBill, createGeneralBill } from './billingActions';

/**
 * A robust function to convert form data keys from form-friendly names
 * to snake_case for the database. This is a highly explicit mapping to prevent errors.
 *
 * @param key The form field key from FormData.
 * @returns The snake_cased key for the database, or the original key if no mapping exists.
 */
function mapKeyToDbField(key: string): string {
    const mappings: { [key: string]: string } = {
        // General
        'type': 'type',
        'applicantName': 'applicant_name',
        'userId': 'user_id',
        'declaration': 'declaration',
        'kbpNumber': 'kbp_number',
        'kdlNumber': 'kdl_number',
        'kopNumber': 'kop_number',
        'applicantAddress': 'applicant_address',
        'plotAddress': 'plot_address',

        // Applicant Info (BPI & Others)
        'title': 'title',
        'firstName': 'first_name',
        'middleName': 'middle_name',
        'surname': 'surname',
        'gender': 'gender',
        'dateOfBirth': 'date_of_birth',
        'occupation': 'occupation',
        'nationality': 'nationality',
        'stateOfOrigin': 'state_of_origin',
        'localGov': 'local_gov',
        'phone1': 'phone1',
        'phone2': 'phone2',
        'email': 'email',
        'idNumber': 'id_number',
        'identificationType': 'identification_type', // Parent for checkboxes

        // Applicant Address
        'appHouseNo': 'app_house_no',
        'appStreetName': 'app_street_name',
        'appDistrict': 'app_district',
        'appCityTown': 'app_city_town',
        'appState': 'app_state',
        'appCountry': 'app_country',
        'appPOBox': 'app_po_box',
        'appCO': 'app_co',
        'appAdditionalAddressInfo': 'app_additional_address_info',

        // Organization Info
        'orgName': 'org_name',
        'cacNumber': 'cac_number',
        'dateOfRegistration': 'date_of_registration',
        'orgTaxIdNumber': 'org_tax_id_number',
        'orgPhone': 'org_phone',
        'orgEmail': 'org_email',
        'orgHouseNo': 'org_house_no',
        'orgStreetName': 'org_street_name',
        'orgDistrict': 'org_district',
        'orgCityTown': 'org_city_town',
        'orgState': 'org_state',
        'orgCountry': 'org_country',
        'orgPOBox': 'org_po_box',
        'orgCO': 'org_co',
        'orgAdditionalAddressInfo': 'org_additional_address_info',
        'orgTin': 'org_tin',

        // CEO Info
        'ceoTitle': 'ceo_title',
        'ceoFirstName': 'ceo_first_name',
        'ceoMiddleName': 'ceo_middle_name',
        'ceoSurname': 'ceo_surname',
        'ceoDesignation': 'ceo_designation',
        'ceoPhone': 'ceo_phone',
        'ceoEmail': 'ceo_email',
        'ceoIdNumber': 'ceo_id_number',
        'ceoIdentificationType': 'ceo_identification_type', // Parent for checkboxes

        // Representative Info
        'repFirstName': 'rep_first_name',
        'repMiddleName': 'rep_middle_name',
        'repSurname': 'rep_surname',
        'repPhone1': 'rep_phone1',
        'repPhone2': 'rep_phone2',
        'repEmail': 'rep_email',
        'repIdNumber': 'rep_id_number',
        'repIdentificationType': 'rep_identification_type', // Parent for checkboxes
        'repHouseNo': 'rep_house_no',
        'repStreetName': 'rep_street_name',
        'repDistrict': 'rep_district',
        'repCityTown': 'rep_city_town',
        'repState': 'rep_state',
        'repCountry': 'rep_country',
        'repPOBox': 'rep_po_box',
        'repCO': 'rep_co',
        'repAdditionalAddressInfo': 'rep_additional_address_info',

        // Plot / Site Info
        'landUse': 'land_use',
        'purpose': 'purpose',
        'plotDistrict': 'plot_district',
        'plotLGA': 'plot_lga',
        'plotDescriptionAddress': 'plot_description_address',
        'siteStreetName': 'site_street_name',
        'siteCityTown': 'site_city_town',
        'siteLGA': 'site_lga',
        'siteState': 'site_state',
        'siteCoordLong': 'site_coord_long',
        'siteCoordLat': 'site_coord_lat',
        'siteTypeOfLand': 'site_type_of_land',
        'siteProofOfOwnership': 'site_proof_of_ownership',
        'siteAddInfo': 'site_add_info',

        // Permit-Specific Fields
        'din': 'din',
        'originalPermitId': 'original_permit_id',
        'kasupdaLicenseNo': 'kasupda_license_no',
        'apconRegNo': 'apcon_reg_no',
        'typeOfDevelopment': 'type_of_development',
        'categoryOfBusiness': 'category_of_business',
        'plotAddressDescription': 'plot_address_description',
        'children': 'children',
        'maritalStatus': 'marital_status',
        'educationLevel': 'education_level',
        'otherEducation': 'other_education',
        'tin': 'tin',
        'typeOfRoad': 'type_of_road',
        'roadLength': 'road_length',
        'coordinates': 'coordinates',
        'locationOfSite': 'location_of_site',
        'mastType': 'mast_type',
        'mastTypeOther': 'mast_type_other',
        'mastDuration': 'mast_duration',
        'mastCommencementDate': 'mast_commencement_date',
        'mastCoordinates': 'mast_coordinates',
        'mastLocationOfShield': 'mast_location_of_shield',
        'applicantCompanyNameIndividual': 'applicant_company_name_individual',
        'applicantFullNameContact': 'applicant_full_name_contact',
        'outdoorActivitySignboardSize': 'outdoor_activity_signboard_size',
        'outdoorActivityOthersSpecify': 'outdoor_activity_others_specify',
        'companyName': 'company_name',
        'boardInstallationOthersText': 'board_installation_others_text',
        'phoneNo': 'phone_no',
        'emailAddress': 'email_address',
        'ceoNameContact': 'ceo_name_contact',

        // Document fields - map from form name to DB name directly
        'docLandTitle': 'doc_land_title',
        'docKadgisAcknowledgement': 'doc_kadgis_acknowledgement',
        'docSar': 'doc_sar',
        'docWorkingDrawings': 'doc_working_drawings',
        'docCalculationSheet': 'doc_calculation_sheet',
        'docBuildersDoc': 'doc_builders_doc',
        'docSoilTest': 'doc_soil_test',
        'docPdfDrawings': 'doc_pdf_drawings',
        'docApplicantId': 'doc_applicant_id',
        'docRepId': 'doc_rep_id',
        'docUtilityBill': 'doc_utility_bill',
        'doc_quality_assurance': 'doc_quality_assurance',
        'doc_kepa_eia_cert': 'doc_kepa_eia_cert',
        'doc_permit': 'doc_permit',
        'doc_co': 'doc_co',
        'doc_building_permit': 'doc_building_permit',
        'docStructuralInfo': 'doc_structural_info',
        // New doc fields from other forms
        'docImageShowingSite': 'doc_image_showing_site',
        'doc_image_showing_site': 'doc_image_showing_site',
        'docConsentLetter': 'doc_consent_letter',
        'doc_consent_letter': 'doc_consent_letter',
        'docLeaseAgreement': 'doc_lease_agreement',
        'docStructuralDrawings': 'doc_structural_drawings',
        'docSiteAnalysisReport': 'doc_site_analysis_report',
        'docKepasEnvImpactAssessment': 'doc_kepas_env_impact_assessment',
        'docSoilInvestigationReport': 'doc_soil_investigation_report',
        'docTelecommunicationDesigns': 'doc_telecommunication_designs',
        'docStructuralCalculationSheets': 'doc_structural_calculation_sheets',
        'docElectricalWorksDrawings': 'doc_electrical_works_drawings',
        'docPoliceReport': 'doc_police_report',
        'docProofOfOutrightPurchase': 'doc_proof_of_outright_purchase',
        'docSitePlan': 'doc_site_plan',
        'docNAMAApproval': 'doc_nama_approval',
        'docNCAAApproval': 'doc_ncaa_approval',
        'docLetterOfAttestation': 'doc_letter_of_attestation',
        'docMechanicalWorksDrawings': 'doc_mechanical_works_drawings',
        'docArchitecturalWorksDrawings': 'doc_architectural_works_drawings',
        'docFireServiceReport': 'doc_fire_service_report',
        'docKasupdaLicense': 'doc_kasupda_license',
        'docSoilInvestigation': 'doc_soil_investigation',
        'docCorporateArconLicense': 'doc_corporate_arcon_license',
        'docTaxClearance': 'doc_tax_clearance',
        'docSiteLocationType': 'doc_site_location_type',
        'docKepaEiaApproval': 'doc_kepa_eia_approval',
        'docStructuralWorkDrawings': 'doc_structural_work_drawings',
        'docImagerySketch': 'doc_imagery_sketch',
        'docSiteLocationInstallationCoordinates': 'doc_site_location_installation_coordinates',
        'docLeaseAgreementLetter': 'doc_lease_agreement_letter'
    };

    return mappings[key] || key;
}


/**
 * Saves a generic application form to the database. This is the main entry point for form submissions.
 */
export async function saveApplication(
    formData: FormData
): Promise<{ success: boolean; applicationId?: string; applicantName?: string; error?: string; }> {
    const supabase = await createSupabaseServerClient();
    const submissionPayload: Record<string, any> = {};

    const type = formData.get('type') as string;
    const applicantName = formData.get('applicantName') as string;
    const userId = formData.get('userId') as string;

    if (!type || !applicantName || !userId) {
        return { success: false, error: 'Missing required application metadata (type, applicantName, or userId).' };
    }

    // Separate top-level columns from data payload
    const topLevelColumns = ['type', 'applicant_name', 'user_id', 'status', 'rejection_reason', 'created_at', 'din'];

    const dbPayload: Record<string, any> = {
        type,
        applicant_name: applicantName,
        user_id: userId,
        status: 'Inprogress',
        data: {} // Initialize data object for JSONB column
    };

    // Process all entries from FormData
    for (const [key, value] of formData.entries()) {
        if (['type', 'userId', 'applicantName'].includes(key)) {
            continue;
        }

        // Handle checkbox groups (e.g., 'identificationType.nationalIdCard')
        if (key.includes('.')) {
            const [parentKey, childKey] = key.split('.');
            // We don't map keys for JSONB data, we keep them as is or use a consistent convention.
            // Let's stick to the form's camelCase for JSONB data to avoid confusion, 
            // OR use the mapping if we want snake_case inside the JSON. 
            // Given the previous code tried to map, let's map to snake_case for consistency 
            // but store it inside 'data'.
            const dbParentKey = mapKeyToDbField(parentKey);

            if (!dbPayload.data[dbParentKey]) {
                dbPayload.data[dbParentKey] = {};
            }
            if (value === 'on') {
                dbPayload.data[dbParentKey][childKey] = true;
            }
            continue;
        }

        const dbKey = mapKeyToDbField(key);

        // Check if this key belongs to a top-level column
        if (topLevelColumns.includes(dbKey)) {
            if (typeof value === 'string') {
                dbPayload[dbKey] = value;
            }
            continue;
        }

        // Otherwise, it goes into the 'data' JSONB column
        if (value instanceof File) {
            if (value.size > 0) {
                const filePath = `${userId}/${uuidv4()}-${value.name}`;
                const { error: uploadError } = await supabase.storage.from('application_documents').upload(filePath, value);

                if (uploadError) {
                    console.error(`Storage error for ${key}:`, uploadError);
                    return { success: false, error: `Storage error for ${key}: ${uploadError.message}` };
                }

                const { data: publicUrlData } = supabase.storage.from('application_documents').getPublicUrl(filePath);
                dbPayload.data[`${dbKey}_url`] = publicUrlData.publicUrl;
            }
        } else if (typeof value === 'string' && value) {
            if (value === 'on') {
                dbPayload.data[dbKey] = true;
            } else if (/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(value)) {
                dbPayload.data[dbKey] = new Date(value).toISOString();
            } else {
                dbPayload.data[dbKey] = value;
            }
        }
    }

    // Clean up empty data fields if necessary, though JSONB handles nulls fine.
    // We don't need to filter nulls from the 'data' object strictly, but it keeps it clean.

    try {
        const { data: insertedData, error: dbError } = await supabase
            .from('applications')
            .insert(dbPayload)
            .select()
            .single();

        if (dbError) {
            console.error('Supabase insert error:', dbError);
            throw dbError;
        }
        if (!insertedData) {
            throw new Error("Failed to get ID from inserted application record.");
        }

        // Automatically create a bill based on application type
        let billingResult;
        if (type === 'DIN Application') {
            billingResult = await createGeneralBill(insertedData, userId, 5000, 'DIN Application Fee');
        } else {
            billingResult = await createGeneralBill(insertedData, userId, 10000, 'Building Permit Application Fee');
        }

        if (!billingResult.success) {
            console.error("Billing creation failed:", billingResult.error);
            return {
                success: true,
                applicationId: insertedData.id,
                applicantName,
                error: `Application saved, but billing failed: ${billingResult.error}`
            };
        }

        return { success: true, applicationId: insertedData.id, applicantName };

    } catch (error: any) {
        console.error('Database Insertion Error (Full):', error);

        let errorMessage = 'An unknown server error occurred during database insertion.';

        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null) {
            // Handle Supabase/Postgrest errors which might not be Error instances
            if ('message' in error) {
                errorMessage = (error as any).message;
            } else if ('error' in error) {
                errorMessage = JSON.stringify((error as any).error);
            } else {
                errorMessage = JSON.stringify(error);
            }
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        return { success: false, error: `Failed to save application: ${errorMessage}` };
    }
}

/**
 * Generates a signed URL for a private file in the application_documents bucket.
 * 
 * @param path The relative path to the file in the bucket.
 * @returns The signed URL or an error.
 */
export async function getSignedUrl(path: string): Promise<{ success: boolean; url?: string; error?: string }> {
    const supabase = await createSupabaseServerClient();

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        return { success: false, error: 'Not authenticated' };
    }

    // Check if user is admin or the owner of the file
    // The storage policy we added handles the actual permission check, 
    // but we can also do a quick check here if needed.

    const { data, error } = await supabase.storage
        .from('application_documents')
        .createSignedUrl(path, 3600); // 1 hour expiry

    if (error) {
        console.error('Error creating signed URL:', error);
        return { success: false, error: error.message };
    }

    return { success: true, url: data.signedUrl };
}
