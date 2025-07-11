/* eslint-disable */
import { ModelInfo, DiagramPromptRequest, DiagramResponse } from '../types';

interface PromptRequest {
  prompt: string;
  model?: string;
  preferred_model_category?: string;
}

// Initial prompt submission response
interface InitialPromptResponse {
  job_id: string;
  status: string;
  message: string;
}

// Response while processing or when complete
interface JobStatusResponse {
  job_id: string;
  status: 'processing' | 'completed' | 'failed';
  progress?: number;
  message?: string;
  visualization?: VisualizationData;
  error?: string;
}

// Visualization data when job is completed
interface VisualizationData {
  html: string;
  title: string;
  timecode_markers: string[];
  total_elements: number;
}

// Legacy response types - keeping for backward compatibility
interface PromptResponse {
  result: string;
  is_molecular: boolean;
  validation_message?: string;
}

interface ComplexPromptResponse {
  html: string;
  js: string;
  title: string;
  timecode_markers: string[];
  total_elements: number;
}

// Response from the classification endpoint
export interface MoleculeClassificationResponse {
  type: 'small' | 'macromolecule' | 'unknown';
  name?: string;
}

// API base URL configuration
// Priority:
// 1) Use NEXT_PUBLIC_API_BASE_URL if provided (allows pointing dev build to production backend)
// 2) Fallback to using Next.js route handlers under `/api`
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

// Only include credentials (cookies) when we are talking to a same-origin localhost backend
const includeCredentials = API_BASE_URL.startsWith('http://localhost');

/**
 * Polls the status of a job
 * @param jobId The job ID returned from submitPrompt
 * @returns The current status of the job
 */
export const pollJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const endpoint = `${API_BASE_URL}/prompt/process/${jobId}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: includeCredentials ? 'include' : 'same-origin',
  });

  if (!response.ok) {
    throw new Error(`Failed to poll job status: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

/**
 * Fetch only the PDB and minimal data for a given molecule query (Step A).
 * Calls /fetch-molecule-data/ on the backend.
 *
 * @param query The molecule name or query
 * @returns An object containing { pdb_data, name, cid, formula, sdf, etc. }
 */
export const fetchMoleculeData = async (
  query: string
): Promise<{
  pdb_data?: string;
  sdf?: string;
  name: string;
  cid: number;
  formula: string;
  info: any;
}> => {
  const endpoint = `${API_BASE_URL}/prompt/fetch-molecule-data/`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: includeCredentials ? 'include' : 'same-origin',
      body: JSON.stringify({ query }),
    });
    let result: any = {};
    try {
      result = await response.json();
    } catch {
      // ignore parse errors
    }

    if (!response.ok) {
      const message = result?.error ? result.error : `${response.status} ${response.statusText}`;
      throw new Error(`Failed to fetch molecule data: ${message}`);
    }

    if (result.detail) {
      throw new Error(result.detail);
    }

    return result;
  } catch (error: any) {
    console.error('Error fetching molecule data:', error);
    throw error;
  }
};

/**
 * Generate the HTML from previously fetched molecule data (Step B).
 * Calls /generate-molecule-html/ on the backend.
 *
 * @param moleculeData The object with { pdb_data, name, cid, sdf, formula, etc. }
 * @returns { html: string }
 */
export const generateMoleculeHTML = async (
  moleculeData: Record<string, any>
): Promise<{ html: string }> => {
  const endpoint = `${API_BASE_URL}/prompt/generate-molecule-html/`;
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: includeCredentials ? 'include' : 'same-origin',
      body: JSON.stringify({ molecule_data: moleculeData }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate HTML: ${response.status} ${response.statusText}`);
    }
    const result = await response.json();
    if (!result.html) {
      throw new Error('No HTML returned from backend');
    }
    return result;
  } catch (error: any) {
    console.error('Error generating HTML:', error);
    throw error;
  }
};

/**
 * Fetches the list of available models from the backend
 * @returns Array of ModelInfo objects containing model capabilities and information
 * @throws Error if the request fails
 */
export const getModels = async (): Promise<ModelInfo[]> => {
  const endpoint = `${API_BASE_URL}/prompt/models/`;

  console.log('Fetching models from:', endpoint);

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: includeCredentials ? 'include' : 'same-origin',
    });

    if (!response.ok) {
      console.error(`Failed to fetch models: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched models:', data);
    return data;
  } catch (error: any) {
    console.error('Error fetching models:', error);
    throw new Error(`Failed to fetch models: ${error.message}`);
  }
};

// ---------------------------------------------
// Molecule diagram (2D) generation endpoint
// ---------------------------------------------

export const generateMoleculeDiagram = async (
  request: DiagramPromptRequest
): Promise<DiagramResponse> => {
  const endpoint = `${API_BASE_URL}/prompt/generate-molecule-diagram/`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: includeCredentials ? 'include' : 'same-origin',
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to generate molecule diagram: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
};
