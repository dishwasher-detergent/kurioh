import { Hono } from 'hono';
import { Query } from 'node-appwrite';

import {
  EDUCATION_COLLECTION_ID,
  EXPERIENCE_COLLECTION_ID,
  INFORMATION_COLLECTION_ID,
  ORGANIZATION_COLLECTION_ID,
  PROJECTS_BUCKET_ID,
  PROJECTS_COLLECTION_ID,
  database_service,
  storage_service,
} from '../lib/appwrite.js';
import {
  Education,
  Experience,
  Information,
  Project,
  Team,
} from '../types/types.js';

export function Teams(app: Hono, cacheDuration: number = 1440) {
  app.get('/teams/:team_id', async (c) => {
    try {
      const team_id = c.req.param('team_id');
      const team = await database_service.get<Team>(
        ORGANIZATION_COLLECTION_ID,
        team_id
      );

      const information = await database_service.get<Information>(
        INFORMATION_COLLECTION_ID,
        team_id
      );

      const projects = await database_service.list<Project>(
        PROJECTS_COLLECTION_ID,
        [Query.equal('teamId', team_id), Query.orderAsc('ordinal')]
      );

      const experience = await database_service.list<Experience>(
        EXPERIENCE_COLLECTION_ID,
        [Query.equal('teamId', team_id)]
      );

      const education = await database_service.list<Education>(
        EDUCATION_COLLECTION_ID,
        [Query.equal('teamId', team_id)]
      );

      const formattedProject = projects.documents.map((project) => ({
        id: project.$id,
        title: project.name,
        shortDescription: project.short_description,
        description: project.description,
        images: project.images,
        tags: project.tags,
        links: project.links,
      }));

      const formattedExperience = experience.documents.map((exp) => ({
        title: exp.title,
        description: exp.description,
        skills: exp.skills,
        startDate: exp.start_date,
        endDate: exp.end_date,
        company: exp.company,
        website: exp.website,
      }));

      const formattedEducation = education.documents.map((exp) => ({
        school: exp.school,
        major: exp.major,
        degree: exp.degree,
        startDate: exp.start_date,
        graduationDate: exp.end_date,
      }));

      const prunedResponse = {
        id: team.$id,
        name: team.name,
        title: information.title,
        description: information.description,
        socials: information.socials,
        image: information.image,
        projects: formattedProject,
        experience: formattedExperience,
        education: formattedEducation,
      };

      return c.json(prunedResponse, 200, {
        'Cache-Control': `public, max-age=${cacheDuration}`,
      });
    } catch (error) {
      console.error(error);

      return c.json({ error: 'Failed to fetch team data.' }, 500);
    }
  });

  app.get('/teams/:team_id/image', async (c) => {
    try {
      const team_id = c.req.param('team_id');
      const queryParams = c.req.query();

      const information = await database_service.get<Information>(
        INFORMATION_COLLECTION_ID,
        team_id
      );

      const file = await storage_service.getFilePreview(
        PROJECTS_BUCKET_ID,
        information.image,
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
      console.error(error);

      return c.json({ error: 'Failed to fetch image.' }, 500);
    }
  });

  app.get('/teams/:team_id/favicon', async (c) => {
    try {
      const team_id = c.req.param('team_id');

      const information = await database_service.get<Information>(
        INFORMATION_COLLECTION_ID,
        team_id
      );

      if (!information.image) {
        return c.json({ error: 'Image not found' }, 404);
      }

      const file = await storage_service.getFilePreview(
        PROJECTS_BUCKET_ID,
        information.image,
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
      console.error(error);

      return c.json({ error: 'Failed to fetch favicon.' }, 500);
    }
  });
}
