using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace DMR_API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
        //    .ConfigureWebHost(config =>
        //    {
        //     config.UseUrls("http://10.9.0.49:80/");
        // })
        //    .UseWindowsService();
    }
}
