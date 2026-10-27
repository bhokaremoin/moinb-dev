export type GiscusConfig = {
  repo: `${string}/${string}`;
  repoId: string;
  category: string;
  categoryId: string;
};

type GiscusEnv = { [Key in keyof GiscusConfig]?: string };

/** Comments are opt-in: they turn on only when every Giscus setting is provided. */
export function createGiscusConfig(env: GiscusEnv): GiscusConfig | undefined {
  const { repo, repoId, category, categoryId } = env;
  if (!repo || !repoId || !category || !categoryId) {
    return undefined;
  }
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    return undefined;
  }
  return { repo: repo as GiscusConfig["repo"], repoId, category, categoryId };
}

export const giscusConfig = createGiscusConfig({
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
});
