import { Hono } from 'hono';
import { Query } from 'node-appwrite';

import {
  EXPERIENCE_COLLECTION_ID,
  INFORMATION_COLLECTION_ID,
  ORGANIZATION_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
  database_service,
  storage_service,
} from '../lib/appwrite.js';
import {
  Experience,
  Information,
  Organization,
  Project,
} from '../types/types.js';

export function Organizations(app: Hono, cacheDuration: number = 1440) {
  app.get('/organizations/:organization_id', async (c) => {
    try {
      const organization_id = c.req.param('organization_id');
      const organization = await database_service.get<Organization>(
        ORGANIZATION_COLLECTION_ID,
        organization_id
      );

      const information = await database_service.get<Information>(
        INFORMATION_COLLECTION_ID,
        organization_id
      );

      const projects = await database_service.list<Project>(
        PROJECTS_COLLECTION_ID,
        [Query.equal('teamId', organization_id)]
      );

      const experience = await database_service.list<Experience>(
        EXPERIENCE_COLLECTION_ID,
        [Query.equal('teamId', organization_id)]
      );

      const formattedInformation = {
        title: information.title,
        description: information.description,
        image_id: information.images,
        socials: information.socials,
      };

      const formattedProject = projects.documents.map((project) => ({
        id: project.$id,
        title: project.title,
        slug: project.slug,
        short_description: project.short_description,
        description: project.description,
        images_ids: project.images,
        tags: project.tags,
        links: project.links,
      }));

      const formattedExperience = experience.documents.map((exp) => ({
        id: exp.$id,
        title: exp.title,
        description: exp.description,
        skills: exp.skills,
        start_date: exp.start_date,
        end_date: exp.end_date,
        company: exp.company,
        website: exp.website,
      }));

      const prunedResponse = {
        id: organization.$id,
        title: organization.title,
        slug: organization.slug,
        information: formattedInformation,
        projects: formattedProject,
        experience: formattedExperience,
      };

      return c.json(prunedResponse, 200, {
        'Cache-Control': `public, max-age=${cacheDuration}`,
      });
    } catch (error) {
      return c.json({ error: 'Failed to fetch organization data.' }, 500);
    }
  });

  app.get('/organizations/:organization_id/image', async (c) => {
    try {
      const organization_id = c.req.param('organization_id');
      const queryParams = c.req.query();

      const information = await database_service.get<Information>(
        INFORMATION_COLLECTION_ID,
        organization_id
      );

      const file = await storage_service.getFilePreview(
        PROJECTS_BUCKET_ID,
        information.image_id,
        {
          ...queryParams,
        }
      );

      if (!file) {
        return c.json({ error: 'Failed to fetch image.' }, 500);
      }

      c.header('Content-Type', `image/png`);
      c.header('Cache-Control', `public, max-age=${cacheDuration}`);
      return c.body(file);
    } catch (error) {
      return c.json({ error: 'Failed to fetch image.' }, 500);
    }
  });

  app.get('/organizations/:organization_id/favicon', async (c) => {
    try {
      const organization_id = c.req.param('organization_id');

      const information = await database_service.get<Information>(
        INFORMATION_COLLECTION_ID,
        organization_id
      );

      if (!information.image_id) {
        return c.json({ error: 'Image not found' }, 404);
      }

      const file = await storage_service.getFilePreview(
        PROJECTS_BUCKET_ID,
        information.image_id,
        {
          quality: 50,
          width: 256,
          height: 256,
        }
      );

      if (!file) {
        return c.json({ error: 'Failed to fetch image.' }, 500);
      }

      c.header('Content-Type', `image/png`);
      c.header('Cache-Control', `public, max-age=${cacheDuration}`);
      return c.body(file);
    } catch (error) {
      return c.json({ error: 'Failed to fetch favicon.' }, 500);
    }
  });
}
