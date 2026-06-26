export interface Company {
  id: number;
  ownerId: number;
  name: string;
  description?: string;
  logoUrl?: string;
  coverPhotoUrl?: string;
  website?: string;
  status: "active" | "suspended" | "pending";
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyMember {
  id: number;
  companyId: number;
  userId: number;
  role: "owner" | "admin" | "member" | "viewer";
  joinedAt: Date;
}

export interface CreateCompanyInput {
  name: string;
  description?: string;
  website?: string;
}

export interface UpdateCompanyInput {
  name?: string;
  description?: string;
  logoUrl?: string;
  coverPhotoUrl?: string;
  website?: string;
}
