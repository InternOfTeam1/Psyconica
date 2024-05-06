export const transformYouTubeUrl = (url: string): string => {
    let videoId = '';
    url = url.trim();
  
    if (url.includes('youtu.be')) {
      videoId = url.split('/').pop()?.split('?')[0] || '';
    } else if (url.includes('youtube.com')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    }
  
    const additionalParams = url.includes('?') ? url.substring(url.indexOf('?') + 1) : '';
    const embedUrl = `https://www.youtube.com/embed/${videoId}${additionalParams ? `?${additionalParams}` : ''}`;
  
    return embedUrl;
  };

  